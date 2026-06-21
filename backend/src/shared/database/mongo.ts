import mongoose from 'mongoose'
import { env } from '../../config/env'
import { logger } from '../utils/logger'

export const connectMongo = async (): Promise<void> => {
  mongoose.set('strictQuery', true)
  const conn = await mongoose.connect(env.MONGODB_URI)
  logger.info(`MongoDB connected: ${conn.connection.host}`)
}

export const disconnectMongo = async (): Promise<void> => {
  await mongoose.connection.close()
  logger.info('MongoDB connection closed')
}
