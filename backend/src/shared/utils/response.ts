import { Response } from 'express'

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Standard success response:
 * { success: true, message, data, pagination? }
 */
export const sendSuccess = (
  res: Response,
  data: unknown = null,
  message = 'Success',
  statusCode = 200,
  pagination?: Pagination
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination ? { pagination } : {})
  })
}

export const buildPagination = (page: number, limit: number, total: number): Pagination => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 0
})
