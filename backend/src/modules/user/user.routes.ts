import { Router } from 'express'
import * as userController from './user.controller'
import { validate } from '../../shared/middleware/validate.middleware'
import { requireAuth } from '../../shared/middleware/auth.middleware'
import {
  updateProfileSchema,
  changePasswordSchema,
  addressSchema,
  idParamSchema
} from './user.schema'

const router = Router()

router.use(requireAuth) // everything under /users requires login

router.get('/me', userController.getMe)
router.put('/me', validate({ body: updateProfileSchema }), userController.updateMe)
router.put('/me/password', validate({ body: changePasswordSchema }), userController.changePassword)

router.post('/me/addresses', validate({ body: addressSchema }), userController.addAddress)
router.put(
  '/me/addresses/:id',
  validate({ params: idParamSchema, body: addressSchema }),
  userController.updateAddress
)
router.delete(
  '/me/addresses/:id',
  validate({ params: idParamSchema }),
  userController.deleteAddress
)

export default router
