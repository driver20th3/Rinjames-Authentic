export interface Category {
  _id: string
  name: string
  slug: string
  parentId?: string
  description?: string
  image?: string
}

export interface Variant {
  _id?: string
  size?: number
  color?: string
  colorHex?: string
  stock: number
  sku?: string
}

export interface Product {
  _id: string
  name: string
  slug: string
  brand?: string
  category: Category | string
  description?: string
  images: string[]
  variants: Variant[]
  price: number
  salePrice?: number
  isActive: boolean
  isFeatured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  pagination?: Pagination
}

export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name'

export interface ProductQuery {
  category?: string
  brand?: string
  size?: number
  color?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  featured?: boolean
  sort?: SortOption
  page?: number
  limit?: number
}
