import { z } from 'zod'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

export const createCategorySchema = z.object({
  name: z.string().min(1).max(80),
  parentId: objectId.optional(),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional()
})

export const updateCategorySchema = createCategorySchema.partial()

export const idParamSchema = z.object({ id: objectId })
export const slugParamSchema = z.object({ slug: z.string().min(1) })
