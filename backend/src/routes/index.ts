import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import userRoutes from '../modules/user/user.routes'
import { productRoutes, adminProductRoutes } from '../modules/product/product.routes'
import { categoryRoutes, adminCategoryRoutes } from '../modules/category/category.routes'
import { sendSuccess } from '../shared/utils/response'
import { env } from '../config/env'

const router = Router()

// Public
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)

// Shop social links (catalog -> inbox to order)
router.get('/shop/social', (_req, res) => {
  sendSuccess(res, {
    facebook: env.SHOP_FACEBOOK_URL,
    instagram: env.SHOP_INSTAGRAM_URL
  })
})

// Admin
router.use('/admin/products', adminProductRoutes)
router.use('/admin/categories', adminCategoryRoutes)

export default router
