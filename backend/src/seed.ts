/**
 * Seed script: base categories + admin account + sample products.
 * Idempotent — safe to run multiple times. Usage: npm run seed
 */
import { connectMongo, disconnectMongo } from './shared/database/mongo'
import { logger } from './shared/utils/logger'
import Category from './modules/category/category.model'
import Product from './modules/product/product.model'
import User from './modules/user/user.model'
import { generateSlug } from './shared/utils/slug'

const CATEGORIES = [
  { name: 'Giày', description: 'Giày dép các loại' },
  { name: 'Quần áo', description: 'Thời trang nam nữ' },
  { name: 'Túi', description: 'Túi xách, balo, ví' }
]

const ADMIN = {
  name: 'Admin',
  email: 'admin@rinjames.com',
  password: 'admin123',
  role: 'admin' as const
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`

type SeedProduct = {
  name: string
  brand: string
  category: 'Giày' | 'Quần áo' | 'Túi'
  price: number
  salePrice?: number
  isFeatured?: boolean
  tags?: string[]
  variants: { size?: number; color?: string; colorHex?: string; stock: number }[]
}

const shoeSizes = (colors: { color: string; colorHex: string }[]) =>
  colors.flatMap((c) => [40, 41, 42, 43].map((size) => ({ size, ...c, stock: 5 })))

const PRODUCTS: SeedProduct[] = [
  {
    name: 'Nike Air Force 1 Low',
    brand: 'Nike',
    category: 'Giày',
    price: 2900000,
    salePrice: 2490000,
    isFeatured: true,
    tags: ['sneaker', 'hot'],
    variants: shoeSizes([
      { color: 'Trắng', colorHex: '#ffffff' },
      { color: 'Đen', colorHex: '#111111' }
    ])
  },
  {
    name: 'Adidas Ultraboost Light',
    brand: 'Adidas',
    category: 'Giày',
    price: 4200000,
    isFeatured: true,
    tags: ['running'],
    variants: shoeSizes([{ color: 'Xám', colorHex: '#9ca3af' }])
  },
  {
    name: 'Converse Chuck 70 High',
    brand: 'Converse',
    category: 'Giày',
    price: 1850000,
    tags: ['classic'],
    variants: shoeSizes([{ color: 'Kem', colorHex: '#f5f5dc' }])
  },
  {
    name: 'Vans Old Skool',
    brand: 'Vans',
    category: 'Giày',
    price: 1650000,
    salePrice: 1390000,
    tags: ['skate'],
    variants: shoeSizes([{ color: 'Đen trắng', colorHex: '#222222' }])
  },
  {
    name: 'New Balance 550',
    brand: 'New Balance',
    category: 'Giày',
    price: 3100000,
    variants: shoeSizes([{ color: 'Xanh', colorHex: '#1e3a8a' }])
  },
  {
    name: 'Áo Thun Cotton Basic',
    brand: 'RinJames',
    category: 'Quần áo',
    price: 250000,
    isFeatured: true,
    tags: ['unisex'],
    variants: [
      { color: 'Trắng', colorHex: '#ffffff', stock: 20 },
      { color: 'Đen', colorHex: '#111111', stock: 20 },
      { color: 'Be', colorHex: '#d8c3a5', stock: 12 }
    ]
  },
  {
    name: 'Hoodie Nỉ Bông',
    brand: 'RinJames',
    category: 'Quần áo',
    price: 450000,
    salePrice: 359000,
    tags: ['winter'],
    variants: [
      { color: 'Xám', colorHex: '#9ca3af', stock: 15 },
      { color: 'Đen', colorHex: '#111111', stock: 15 }
    ]
  },
  {
    name: 'Quần Jeans Slim Fit',
    brand: 'Levi’s',
    category: 'Quần áo',
    price: 690000,
    tags: ['denim'],
    variants: [{ color: 'Xanh đậm', colorHex: '#1e3a8a', stock: 18 }]
  },
  {
    name: 'Áo Sơ Mi Oxford',
    brand: 'Uniqlo',
    category: 'Quần áo',
    price: 520000,
    variants: [
      { color: 'Trắng', colorHex: '#ffffff', stock: 14 },
      { color: 'Xanh nhạt', colorHex: '#bfdbfe', stock: 10 }
    ]
  },
  {
    name: 'Balo Laptop Chống Nước',
    brand: 'RinJames',
    category: 'Túi',
    price: 590000,
    salePrice: 490000,
    isFeatured: true,
    tags: ['balo'],
    variants: [
      { color: 'Đen', colorHex: '#111111', stock: 25 },
      { color: 'Xám', colorHex: '#9ca3af', stock: 15 }
    ]
  },
  {
    name: 'Túi Tote Canvas',
    brand: 'RinJames',
    category: 'Túi',
    price: 220000,
    tags: ['tote'],
    variants: [{ color: 'Kem', colorHex: '#f5f5dc', stock: 30 }]
  },
  {
    name: 'Túi Đeo Chéo Mini',
    brand: 'RinJames',
    category: 'Túi',
    price: 350000,
    variants: [
      { color: 'Đen', colorHex: '#111111', stock: 20 },
      { color: 'Nâu', colorHex: '#8b5a2b', stock: 12 }
    ]
  }
]

const seed = async () => {
  await connectMongo()

  // Categories
  const catMap = new Map<string, any>()
  for (const c of CATEGORIES) {
    const slug = generateSlug(c.name)
    let cat = await Category.findOne({ slug })
    if (!cat) {
      cat = await Category.create({ ...c, slug, image: img(`cat-${slug}`) })
      logger.info(`Created category: ${c.name} [${slug}]`)
    }
    catMap.set(c.name, cat)
  }

  // Admin
  if (!(await User.findOne({ email: ADMIN.email }))) {
    await User.create({ ...ADMIN, provider: 'local' })
    logger.info(`Created admin: ${ADMIN.email} / ${ADMIN.password}`)
  }

  // Products
  let created = 0
  for (const p of PRODUCTS) {
    const slug = generateSlug(p.name)
    if (await Product.findOne({ slug })) continue
    const category = catMap.get(p.category)
    await Product.create({
      name: p.name,
      slug,
      brand: p.brand,
      category: category._id,
      description: `${p.name} — hàng tuyển chọn tại RinJames Authentic.`,
      images: [img(slug), img(`${slug}-2`)],
      variants: p.variants,
      price: p.price,
      salePrice: p.salePrice,
      isFeatured: p.isFeatured ?? false,
      tags: p.tags ?? []
    })
    created++
  }
  logger.info(`Created ${created} new products (${PRODUCTS.length} defined)`)

  await disconnectMongo()
  process.exit(0)
}

seed().catch((err) => {
  logger.error('Seed failed', err)
  process.exit(1)
})
