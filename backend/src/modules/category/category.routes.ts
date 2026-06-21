import { Router } from 'express'
import * as categoryController from './category.controller'
import { validate } from '../../shared/middleware/validate.middleware'
import { requireAuth, requireAdmin } from '../../shared/middleware/auth.middleware'
import {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema,
  slugParamSchema
} from './category.schema'

// ---- Public: /api/categories ----
export const categoryRoutes = Router()

categoryRoutes.get('/', categoryController.listCategories)
categoryRoutes.get('/:slug', validate({ params: slugParamSchema }), categoryController.getCategoryBySlug)

// ---- Admin: /api/admin/categories ----
export const adminCategoryRoutes = Router()

adminCategoryRoutes.use(requireAuth, requireAdmin)

adminCategoryRoutes.get('/', categoryController.listCategories)
adminCategoryRoutes.get('/:id', validate({ params: idParamSchema }), categoryController.getCategoryById)
adminCategoryRoutes.post('/', validate({ body: createCategorySchema }), categoryController.createCategory)
adminCategoryRoutes.put(
  '/:id',
  validate({ params: idParamSchema, body: updateCategorySchema }),
  categoryController.updateCategory
)
adminCategoryRoutes.delete(
  '/:id',
  validate({ params: idParamSchema }),
  categoryController.deleteCategory
)
