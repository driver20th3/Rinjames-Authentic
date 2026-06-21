import { Router } from 'express'
import * as productController from './product.controller'
import { validate } from '../../shared/middleware/validate.middleware'
import { requireAuth, requireAdmin } from '../../shared/middleware/auth.middleware'
import { upload } from '../../shared/middleware/upload.middleware'
import {
  createProductSchema,
  updateProductSchema,
  listProductQuerySchema,
  adminListProductQuerySchema,
  idParamSchema,
  slugParamSchema
} from './product.schema'

// ---- Public: /api/products ----
export const productRoutes = Router()

productRoutes.get('/', validate({ query: listProductQuerySchema }), productController.listProducts)
productRoutes.get('/brands', productController.getBrands)
productRoutes.get('/:slug', validate({ params: slugParamSchema }), productController.getProductBySlug)
productRoutes.get(
  '/:slug/related',
  validate({ params: slugParamSchema }),
  productController.getRelatedProducts
)

// ---- Admin: /api/admin/products ----
export const adminProductRoutes = Router()

adminProductRoutes.use(requireAuth, requireAdmin)

adminProductRoutes.get(
  '/',
  validate({ query: adminListProductQuerySchema }),
  productController.listProductsAdmin
)
adminProductRoutes.get('/:id', validate({ params: idParamSchema }), productController.getProductByIdAdmin)
adminProductRoutes.post('/', validate({ body: createProductSchema }), productController.createProduct)
adminProductRoutes.put(
  '/:id',
  validate({ params: idParamSchema, body: updateProductSchema }),
  productController.updateProduct
)
adminProductRoutes.delete('/:id', validate({ params: idParamSchema }), productController.deleteProduct)
adminProductRoutes.post(
  '/:id/images',
  validate({ params: idParamSchema }),
  upload.array('images', 6),
  productController.uploadProductImages
)
