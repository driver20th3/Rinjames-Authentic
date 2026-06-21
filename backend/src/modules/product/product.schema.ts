import { z } from 'zod'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

export const variantSchema = z.object({
  size: z.coerce.number().min(20).max(60).optional(),
  color: z.string().max(40).optional(),
  colorHex: z.string().max(9).optional(),
  stock: z.coerce.number().min(0).default(0),
  sku: z.string().max(60).optional()
})

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  brand: z.string().max(80).optional(),
  category: objectId,
  description: z.string().max(5000).optional(),
  images: z.array(z.string().url()).optional(),
  variants: z.array(variantSchema).optional(),
  price: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional()
})

// All fields optional on update.
export const updateProductSchema = createProductSchema.partial()

export const listProductQuerySchema = z.object({
  category: z.string().optional(), // slug or id
  brand: z.string().optional(),
  size: z.coerce.number().optional(),
  color: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  sort: z.enum(['newest', 'oldest', 'price-asc', 'price-desc', 'name']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12)
})

export const idParamSchema = z.object({ id: objectId })
export const slugParamSchema = z.object({ slug: z.string().min(1) })
