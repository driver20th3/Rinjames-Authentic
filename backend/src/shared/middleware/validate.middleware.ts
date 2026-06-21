import { Request, Response, NextFunction } from 'express'
import { ZodTypeAny } from 'zod'

interface ValidationSchemas {
  body?: ZodTypeAny
  query?: ZodTypeAny
  params?: ZodTypeAny
}

/**
 * Validate request parts against Zod schemas. Parsed (and coerced) values
 * replace the originals so controllers receive clean, typed data.
 * Throws ZodError on failure -> handled centrally by errorHandler.
 */
export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body)
      if (schemas.params) req.params = schemas.params.parse(req.params) as any
      if (schemas.query) {
        // req.query is a read-only getter in Express 5; mutate in place instead of reassigning.
        const parsed = schemas.query.parse(req.query)
        Object.assign(req.query, parsed)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
