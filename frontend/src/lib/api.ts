import apiClient from './api-client'
import {
  ApiResponse,
  Category,
  Pagination,
  Product,
  ProductQuery
} from '@/types'

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/api/categories')
  return data.data
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const { data } = await apiClient.get<ApiResponse<Category>>(`/api/categories/${slug}`)
  return data.data
}

export async function getProducts(
  query: ProductQuery = {}
): Promise<{ products: Product[]; pagination?: Pagination }> {
  const { data } = await apiClient.get<ApiResponse<Product[]>>('/api/products', {
    params: query
  })
  return { products: data.data, pagination: data.pagination }
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data } = await apiClient.get<ApiResponse<Product>>(`/api/products/${slug}`)
  return data.data
}

export async function getShopSocial(): Promise<{ facebook: string; instagram: string }> {
  const { data } = await apiClient.get<ApiResponse<{ facebook: string; instagram: string }>>(
    '/api/shop/social'
  )
  return data.data
}
