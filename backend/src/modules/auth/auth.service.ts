import crypto from 'crypto'
import User, { IUser } from '../user/user.model'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../config/jwt'
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_GRAPH_VERSION } from '../../config/facebook'
import { env } from '../../config/env'
import { sendEmail, passwordResetEmail } from '../../shared/utils/email'
import { ConflictError, UnauthorizedError, BadRequestError } from '../../shared/utils/errors'

interface FacebookProfile {
  id: string
  name: string
  email?: string
  avatar?: string
}

class AuthService {
  private publicUser(user: IUser) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  }

  /** Issue access + refresh tokens and persist the refresh token on the user. */
  private async issueTokens(user: IUser) {
    const accessToken = signAccessToken({ id: user._id.toString(), role: user.role })
    const refreshToken = signRefreshToken({ id: user._id.toString() })
    user.refreshToken = refreshToken
    await user.save()
    return { user: this.publicUser(user), accessToken, refreshToken }
  }

  async register(input: { name: string; email: string; password: string; phone?: string }) {
    const existing = await User.findOne({ email: input.email.toLowerCase() })
    if (existing) throw new ConflictError('Email already registered')

    const user = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password,
      phone: input.phone,
      provider: 'local'
    })

    return this.issueTokens(user)
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials')

    const match = await user.comparePassword(password)
    if (!match) throw new UnauthorizedError('Invalid credentials')

    return this.issueTokens(user)
  }

  async refresh(token: string) {
    if (!token) throw new UnauthorizedError('Refresh token is required')

    let payload
    try {
      payload = verifyRefreshToken(token)
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }

    // The stored token must match (allows server-side revocation on logout).
    const user = await User.findById(payload.id).select('+refreshToken')
    if (!user || user.refreshToken !== token) {
      throw new UnauthorizedError('Refresh token has been revoked')
    }

    return this.issueTokens(user) // rotate
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } })
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email: email.toLowerCase() })
    // Always behave the same to avoid leaking which emails exist.
    if (!user) return { sent: true }

    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex')
    user.resetPasswordToken = hashed
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1h
    await user.save()

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`
    const mail = passwordResetEmail(resetLink)
    await sendEmail({ to: user.email, ...mail })

    // Expose token in non-production so the flow is testable without a mail server.
    return env.NODE_ENV === 'production' ? { sent: true } : { sent: true, resetToken: rawToken }
  }

  async resetPassword(token: string, newPassword: string) {
    const hashed = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() }
    }).select('+resetPasswordToken +resetPasswordExpires')

    if (!user) throw new BadRequestError('Invalid or expired reset token')

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.refreshToken = undefined // force re-login everywhere
    await user.save()

    return { reset: true }
  }

  async facebookLogin(accessToken: string) {
    if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
      throw new BadRequestError('Facebook login is not configured')
    }

    const profile = await this.verifyFacebookToken(accessToken)
    if (!profile.email) {
      throw new BadRequestError(
        'Your Facebook account has no email. Please register with email/password instead.'
      )
    }
    const email = profile.email.toLowerCase()

    let user = await User.findOne({ facebookId: profile.id })
    if (!user) {
      user = await User.findOne({ email })
      if (user) {
        user.facebookId = profile.id
        if (!user.avatar && profile.avatar) user.avatar = profile.avatar
        await user.save()
      }
    }
    if (!user) {
      user = await User.create({
        email,
        name: profile.name,
        provider: 'facebook',
        facebookId: profile.id,
        avatar: profile.avatar
      })
    }

    return this.issueTokens(user)
  }

  private async verifyFacebookToken(accessToken: string): Promise<FacebookProfile> {
    const appAccessToken = `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`
    const base = `https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}`

    const debugUrl = `${base}/debug_token?input_token=${encodeURIComponent(
      accessToken
    )}&access_token=${encodeURIComponent(appAccessToken)}`
    const debugRes = await fetch(debugUrl)
    const debugJson: any = await debugRes.json()
    const data = debugJson?.data
    if (!data || !data.is_valid) throw new UnauthorizedError('Invalid Facebook access token')
    if (String(data.app_id) !== String(FACEBOOK_APP_ID)) {
      throw new UnauthorizedError('Facebook token was issued for a different app')
    }

    const proof = crypto.createHmac('sha256', FACEBOOK_APP_SECRET).update(accessToken).digest('hex')
    const fields = 'id,name,email,picture.type(large)'
    const meUrl = `${base}/me?fields=${fields}&access_token=${encodeURIComponent(
      accessToken
    )}&appsecret_proof=${proof}`
    const meRes = await fetch(meUrl)
    const me: any = await meRes.json()
    if (!me || me.error || !me.id) throw new UnauthorizedError('Could not fetch Facebook profile')

    return {
      id: me.id,
      name: me.name || 'Facebook User',
      email: me.email,
      avatar: me.picture?.data?.url
    }
  }
}

export default new AuthService()
