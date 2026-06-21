import { Request, Response, NextFunction } from 'express'
import authService from './auth.service'
import { sendSuccess } from '../../shared/utils/response'
import { AuthRequest } from '../../shared/types'

const REFRESH_COOKIE = 'refreshToken'
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body)
    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions)
    sendSuccess(res, result, 'Registered successfully', 201)
  } catch (e) {
    next(e)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body.email, req.body.password)
    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions)
    sendSuccess(res, result, 'Login successful')
  } catch (e) {
    next(e)
  }
}

export const facebookLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.facebookLogin(req.body.accessToken)
    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions)
    sendSuccess(res, result, 'Facebook login successful')
  } catch (e) {
    next(e)
  }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE] || req.body.refreshToken
    const result = await authService.refresh(token)
    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions)
    sendSuccess(res, result, 'Token refreshed')
  } catch (e) {
    next(e)
  }
}

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user) await authService.logout(req.user.id)
    res.clearCookie(REFRESH_COOKIE)
    sendSuccess(res, null, 'Logout successful')
  } catch (e) {
    next(e)
  }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.forgotPassword(req.body.email)
    sendSuccess(res, result, 'If the email exists, a reset link has been sent')
  } catch (e) {
    next(e)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.resetPassword(req.body.token, req.body.password)
    sendSuccess(res, result, 'Password reset successful')
  } catch (e) {
    next(e)
  }
}
