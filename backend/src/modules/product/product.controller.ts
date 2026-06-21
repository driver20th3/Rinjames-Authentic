import { Request, Response, NextFunction } from 'express'
import productService, { AdminProductFilters, ProductFilters } from './product.service'
import { sendSuccess } from '../../shared/utils/response'
import { uploadToCloudinary } from '../../shared/middleware/upload.middleware'
import { BadRequestError } from '../../shared/utils/errors'

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query as unknown as ProductFilters
    const { products, pagination } = await productService.list(filters)
    sendSuccess(res, products, 'Products retrieved', 200, pagination)
  } catch (e) {
    next(e)
  }
}

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getBySlug(req.params.slug)
    sendSuccess(res, product, 'Product retrieved')
  } catch (e) {
    next(e)
  }
}

export const getBrands = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await productService.getBrands()
    sendSuccess(res, brands, 'Brands retrieved')
  } catch (e) {
    next(e)
  }
}

export const getRelatedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getRelated(req.params.slug)
    sendSuccess(res, products, 'Related products retrieved')
  } catch (e) {
    next(e)
  }
}

// ---- Admin ----
export const listProductsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query as unknown as AdminProductFilters
    const { products, pagination } = await productService.listAdmin(filters)
    sendSuccess(res, products, 'Products retrieved', 200, pagination)
  } catch (e) {
    next(e)
  }
}

export const getProductByIdAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getById(req.params.id)
    sendSuccess(res, product, 'Product retrieved')
  } catch (e) {
    next(e)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.create(req.body)
    sendSuccess(res, product, 'Product created', 201)
  } catch (e) {
    next(e)
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.update(req.params.id, req.body)
    sendSuccess(res, product, 'Product updated')
  } catch (e) {
    next(e)
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.remove(req.params.id)
    sendSuccess(res, null, 'Product deleted')
  } catch (e) {
    next(e)
  }
}

export const uploadProductImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = (req.files as Express.Multer.File[]) || []
    if (files.length === 0) throw new BadRequestError('No image files uploaded')

    const urls = await Promise.all(files.map((f) => uploadToCloudinary(f)))
    const product = await productService.addImages(req.params.id, urls)
    sendSuccess(res, product, 'Images uploaded')
  } catch (e) {
    next(e)
  }
}
