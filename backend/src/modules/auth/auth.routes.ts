import { Router } from 'express'
import * as authController from './auth.controller'
import { validate } from '../../shared/middleware/validate.middleware'
import { requireAuth } from '../../shared/middleware/auth.middleware'
import {
  registerSchema,
  loginSchema,
  facebookSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from './auth.schema'

const router = Router()

router.post('/register', validate({ body: registerSchema }), authController.register)
router.post('/login', validate({ body: loginSchema }), authController.login)
router.post('/facebook', validate({ body: facebookSchema }), authController.facebookLogin)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', requireAuth, authController.logout)
router.post('/forgot-password', validate({ body: forgotPasswordSchema }), authController.forgotPassword)
router.post('/reset-password', validate({ body: resetPasswordSchema }), authController.resetPassword)

export default router
