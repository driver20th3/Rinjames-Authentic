// End-to-end API test.
// Usage: node scripts/api-test.mjs [baseURL]
//   - baseURL defaults to $API_URL or http://localhost:5000
//   - requires the server running + `npm run seed` (creates the admin account)
import http from 'node:http'
const BASE = (process.argv[2] || process.env.API_URL || 'http://localhost:5000')
  .trim()
  .replace(/\/+$/, '')
const BASE_URL = new URL(BASE)
let pass = 0,
  fail = 0
const results = []

function check(name, cond, detail = '') {
  if (cond) {
    pass++
    results.push(`  \x1b[32m✓\x1b[0m ${name}`)
  } else {
    fail++
    results.push(`  \x1b[31m✗\x1b[0m ${name} ${detail ? '-> ' + detail : ''}`)
  }
}

function req(method, path, { token, body } = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null
    const headers = { 'Content-Type': 'application/json' }
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload)
    if (token) headers.Authorization = `Bearer ${token}`
    const r = http.request(
      { hostname: BASE_URL.hostname, port: BASE_URL.port, path, method, headers },
      (res) => {
        let data = ''
        res.on('data', (c) => (data += c))
        res.on('end', () => {
          let json = null
          try {
            json = JSON.parse(data)
          } catch {}
          resolve({ status: res.statusCode, json })
        })
      }
    )
    r.on('error', reject)
    if (payload) r.write(payload)
    r.end()
  })
}

const ts = Date.now()
const email = `qa${ts}@example.com`

async function run() {
  // --- Health ---
  let r = await req('GET', '/health')
  check('GET /health -> 200', r.status === 200 && r.json?.success)

  // --- Auth: register ---
  r = await req('POST', '/api/auth/register', {
    body: { name: 'QA User', email, password: 'secret123', phone: '0900000000' }
  })
  check('POST /api/auth/register -> 201', r.status === 201, `status ${r.status}`)
  check('  returns accessToken + refreshToken', !!r.json?.data?.accessToken && !!r.json?.data?.refreshToken)
  check('  password NOT leaked in user', r.json?.data?.user?.password === undefined)
  let access = r.json?.data?.accessToken
  let refresh = r.json?.data?.refreshToken

  // --- Validation ---
  r = await req('POST', '/api/auth/register', { body: { name: 'x', email: 'bad', password: '1' } })
  check('register bad payload -> 422', r.status === 422, `status ${r.status}`)

  // --- Duplicate email ---
  r = await req('POST', '/api/auth/register', { body: { name: 'Dup', email, password: 'secret123' } })
  check('register duplicate email -> 409', r.status === 409, `status ${r.status}`)

  // --- Login ---
  r = await req('POST', '/api/auth/login', { body: { email, password: 'secret123' } })
  check('POST /api/auth/login -> 200', r.status === 200 && !!r.json?.data?.accessToken)
  access = r.json?.data?.accessToken || access
  refresh = r.json?.data?.refreshToken || refresh

  // --- Wrong password ---
  r = await req('POST', '/api/auth/login', { body: { email, password: 'wrong' } })
  check('login wrong password -> 401', r.status === 401, `status ${r.status}`)

  // --- Refresh token (right after login, before password change revokes it) ---
  r = await req('POST', '/api/auth/refresh-token', { body: { refreshToken: refresh } })
  check('POST /api/auth/refresh-token -> 200', r.status === 200 && !!r.json?.data?.accessToken)
  access = r.json?.data?.accessToken || access

  // --- Me ---
  r = await req('GET', '/api/users/me', { token: access })
  check('GET /api/users/me -> 200', r.status === 200 && r.json?.data?.email === email)
  check('  /me does NOT leak password', r.json?.data?.password === undefined)

  // --- Me without token ---
  r = await req('GET', '/api/users/me')
  check('GET /api/users/me no token -> 401', r.status === 401, `status ${r.status}`)

  // --- Update profile ---
  r = await req('PUT', '/api/users/me', { token: access, body: { name: 'QA Updated' } })
  check('PUT /api/users/me -> 200', r.status === 200 && r.json?.data?.name === 'QA Updated')

  // --- Addresses CRUD ---
  r = await req('POST', '/api/users/me/addresses', {
    token: access,
    body: { label: 'Nhà', street: '123 Lê Lợi', city: 'TP.HCM' }
  })
  check('POST address -> 201', r.status === 201 && Array.isArray(r.json?.data))
  check('  first address auto isDefault', r.json?.data?.[0]?.isDefault === true)
  const addrId = r.json?.data?.[0]?._id
  r = await req('PUT', `/api/users/me/addresses/${addrId}`, {
    token: access,
    body: { city: 'Hà Nội' }
  })
  check('PUT address -> 200', r.status === 200 && r.json?.data?.[0]?.city === 'Hà Nội')
  r = await req('DELETE', `/api/users/me/addresses/${addrId}`, { token: access })
  check('DELETE address -> 200', r.status === 200 && r.json?.data?.length === 0)

  // --- Change password ---
  r = await req('PUT', '/api/users/me/password', {
    token: access,
    body: { currentPassword: 'secret123', newPassword: 'secret456' }
  })
  check('PUT change password -> 200', r.status === 200, `status ${r.status}`)

  // --- Old refresh token revoked after password change (security) ---
  r = await req('POST', '/api/auth/refresh-token', { body: { refreshToken: refresh } })
  check('old refresh token revoked after pw change -> 401', r.status === 401, `status ${r.status}`)

  // --- Categories ---
  r = await req('GET', '/api/categories')
  check('GET /api/categories -> 200', r.status === 200 && Array.isArray(r.json?.data))
  const giay = r.json?.data?.find((c) => c.slug === 'giay')
  check('  has category giay', !!giay)
  r = await req('GET', '/api/categories/giay')
  check('GET /api/categories/giay -> 200', r.status === 200 && r.json?.data?.slug === 'giay')

  // --- Admin login ---
  r = await req('POST', '/api/auth/login', {
    body: { email: 'admin@rinjames.com', password: 'admin123' }
  })
  check('admin login -> 200', r.status === 200 && r.json?.data?.user?.role === 'admin')
  const adminToken = r.json?.data?.accessToken

  // --- Customer forbidden on admin ---
  r = await req('POST', '/api/admin/products', {
    token: access,
    body: { name: 'X', category: giay?._id, price: 1 }
  })
  check('customer create product -> 403', r.status === 403, `status ${r.status}`)

  // --- Admin create product ---
  const pname = `QA Shoe ${ts}`
  r = await req('POST', '/api/admin/products', {
    token: adminToken,
    body: {
      name: pname,
      brand: 'TestBrand',
      category: giay?._id,
      price: 1500000,
      salePrice: 1200000,
      isFeatured: true,
      variants: [{ size: 42, color: 'Xanh', stock: 7, sku: `QA-${ts}-42` }],
      tags: ['qa']
    }
  })
  check('admin create product -> 201', r.status === 201, `status ${r.status}`)
  check('  slug auto-generated', !!r.json?.data?.slug)
  const prodId = r.json?.data?._id
  const prodSlug = r.json?.data?.slug

  // --- Public list / filter / sort ---
  r = await req('GET', '/api/products?category=giay&sort=price-asc&limit=5')
  check('GET /api/products?category=giay -> 200', r.status === 200 && Array.isArray(r.json?.data))
  check('  pagination present', !!r.json?.pagination)
  r = await req('GET', '/api/products?featured=true')
  check('GET /api/products?featured=true returns items', (r.json?.data?.length || 0) >= 1)
  r = await req('GET', `/api/products/${prodSlug}`)
  check('GET /api/products/:slug -> 200', r.status === 200 && r.json?.data?.name === pname)

  // --- Admin update product ---
  r = await req('PUT', `/api/admin/products/${prodId}`, {
    token: adminToken,
    body: { price: 999000 }
  })
  check('PUT /api/admin/products/:id -> 200', r.status === 200 && r.json?.data?.price === 999000)

  // --- Admin create category + delete ---
  r = await req('POST', '/api/admin/categories', { token: adminToken, body: { name: `QA Cat ${ts}` } })
  check('admin create category -> 201', r.status === 201, `status ${r.status}`)
  const catId = r.json?.data?._id
  r = await req('DELETE', `/api/admin/categories/${catId}`, { token: adminToken })
  check('admin delete category -> 200', r.status === 200, `status ${r.status}`)

  // --- Cleanup test product ---
  r = await req('DELETE', `/api/admin/products/${prodId}`, { token: adminToken })
  check('admin delete product -> 200', r.status === 200, `status ${r.status}`)

  // --- 404 route ---
  r = await req('GET', '/api/does-not-exist')
  check('unknown route -> 404', r.status === 404, `status ${r.status}`)

  // --- Report ---
  console.log('\n' + results.join('\n'))
  console.log(`\n\x1b[1mTotal: ${pass + fail}  |  PASS ${pass}  |  FAIL ${fail}\x1b[0m`)
  process.exit(fail === 0 ? 0 : 1)
}

run().catch((e) => {
  console.error('Test runner crashed:', e)
  process.exit(2)
})
