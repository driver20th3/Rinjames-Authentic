import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Error as MongooseError } from 'mongoose'
import { AppError } from '../utils/errors'
import { logger } from '../utils/logger'

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  })
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    const message = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    return res.status(422).json({ success: false, message })
  }

  // Mongoose validation
  if (err instanceof MongooseError.ValidationError) {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ')
    return res.status(422).json({ success: false, message })
  }

  // Mongoose bad ObjectId
  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` })
  }

  // Mongo duplicate key
  if (typeof err === 'object' && err !== null && (err as any).code === 11000) {
    const fields = Object.keys((err as any).keyValue || {}).join(', ')
    return res.status(409).json({ success: false, message: `Duplicate value for: ${fields}` })
  }

  // Our operational errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) logger.error(err.message, err)
    return res.status(err.statusCode).json({ success: false, message: err.message })
  }

  // Unknown / unexpected
  const e = err as Error
  logger.error(`Unhandled error: ${e?.message}`, e)
  res.status(500).json({
    success: false,
    message: e?.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: e?.stack })
  })
}
