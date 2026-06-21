import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'

import { env } from './config/env'
import { swaggerSpec } from './config/swagger'
import routes from './routes'
import { errorHandler, notFoundHandler } from './shared/middleware/error.middleware'

export const createApp = (): Application => {
  const app = express()

  // Security & parsing
  app.use(helmet())
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true
    })
  )
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  // Global rate limit
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests, please try again later' }
    })
  )

  // Stricter limit on auth endpoints (brute-force protection)
  app.use(
    '/api/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 30,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many auth attempts, please try again later' }
    })
  )

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() })
  })

  // API docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Routes
  app.use('/api', routes)

  // 404 + error handler (must be last)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
