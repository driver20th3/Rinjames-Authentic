import { Request, Response, NextFunction } from 'express'
import categoryService from './category.service'
import { sendSuccess } from '../../shared/utils/response'

export const listCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.list()
    sendSuccess(res, categories, 'Categories retrieved')
  } catch (e) {
    next(e)
  }
}

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getBySlug(req.params.slug)
    sendSuccess(res, category, 'Category retrieved')
  } catch (e) {
    next(e)
  }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.create(req.body)
    sendSuccess(res, category, 'Category created', 201)
  } catch (e) {
    next(e)
  }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.update(req.params.id, req.body)
    sendSuccess(res, category, 'Category updated')
  } catch (e) {
    next(e)
  }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categoryService.remove(req.params.id)
    sendSuccess(res, null, 'Category deleted')
  } catch (e) {
    next(e)
  }
}
