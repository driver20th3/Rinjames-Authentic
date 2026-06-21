import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from './jwt'

describe('jwt', () => {
  it('signs and verifies an access token round-trip', () => {
    const token = signAccessToken({ id: 'u1', role: 'admin' })
    const payload = verifyAccessToken(token)
    expect(payload.id).toBe('u1')
    expect(payload.role).toBe('admin')
  })

  it('signs and verifies a refresh token round-trip', () => {
    const token = signRefreshToken({ id: 'u2' })
    expect(verifyRefreshToken(token).id).toBe('u2')
  })

  it('rejects an access token verified with the refresh secret', () => {
    const token = signAccessToken({ id: 'u3', role: 'customer' })
    expect(() => verifyRefreshToken(token)).toThrow()
  })
})
