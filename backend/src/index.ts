import { createApp } from './app'
import { env } from './config/env'
import { connectMongo, disconnectMongo } from './shared/database/mongo'
import { logger } from './shared/utils/logger'

const start = async () => {
  try {
    await connectMongo()

    const app = createApp()
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} (${env.NODE_ENV})`)
      logger.info(`📚 API docs: http://localhost:${env.PORT}/api-docs`)
    })

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down...`)
      server.close(async () => {
        await disconnectMongo()
        process.exit(0)
      })
    }
    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
  } catch (err) {
    logger.error('Failed to start server', err as Error)
    process.exit(1)
  }
}

start()
