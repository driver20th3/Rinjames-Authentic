import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env'
import User from '../../modules/user/user.model'
import { UnauthorizedError, ForbiddenError } from '../utils/errors'
import { AuthRequest, AccessTokenPayload } from '../types'

/** Verify the access token in the Authorization header and attach req.user. */
export const requireAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload

    const user = await User.findById(decoded.id).select('-password -refreshToken')
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive')
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    }

    next()
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Invalid or expired token'))
    }
    next(error)
  }
}

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ForbiddenError('Admin access required'))
  }
  next()
}
