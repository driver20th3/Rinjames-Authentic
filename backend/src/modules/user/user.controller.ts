import { Response, NextFunction } from 'express'
import userService from './user.service'
import { sendSuccess } from '../../shared/utils/response'
import { AuthRequest } from '../../shared/types'

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getProfile(req.user!.id)
    sendSuccess(res, user, 'Profile retrieved')
  } catch (e) {
    next(e)
  }
}

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateProfile(req.user!.id, req.body)
    sendSuccess(res, user, 'Profile updated')
  } catch (e) {
    next(e)
  }
}

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await userService.changePassword(
      req.user!.id,
      req.body.currentPassword,
      req.body.newPassword
    )
    sendSuccess(res, result, 'Password changed')
  } catch (e) {
    next(e)
  }
}

export const addAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const addresses = await userService.addAddress(req.user!.id, req.body)
    sendSuccess(res, addresses, 'Address added', 201)
  } catch (e) {
    next(e)
  }
}

export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const addresses = await userService.updateAddress(req.user!.id, req.params.id, req.body)
    sendSuccess(res, addresses, 'Address updated')
  } catch (e) {
    next(e)
  }
}

export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const addresses = await userService.deleteAddress(req.user!.id, req.params.id)
    sendSuccess(res, addresses, 'Address deleted')
  } catch (e) {
    next(e)
  }
}
