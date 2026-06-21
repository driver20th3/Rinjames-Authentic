/**
 * Seed script: ensures base categories + an admin account exist.
 * Run with: npx ts-node src/seed.ts
 */
import { connectMongo, disconnectMongo } from './shared/database/mongo'
import { logger } from './shared/utils/logger'
import Category from './modules/category/category.model'
import User from './modules/user/user.model'
import { generateSlug } from './shared/utils/slug'

const CATEGORIES = [
  { name: 'Giày', description: 'Giày dép các loại' },
  { name: 'Quần áo', description: 'Thời trang nam nữ' },
  { name: 'Túi', description: 'Túi xách, balo, ví' }
]

const ADMIN = {
  name: 'Admin',
  email: 'admin@rinjames.com',
  password: 'admin123',
  role: 'admin' as const
}

const seed = async () => {
  await connectMongo()

  for (const c of CATEGORIES) {
    const slug = generateSlug(c.name)
    const existing = await Category.findOne({ slug })
    if (existing) {
      logger.info(`Category exists: ${c.name} [${slug}]`)
    } else {
      await Category.create({ ...c, slug })
      logger.info(`Created category: ${c.name} [${slug}]`)
    }
  }

  const existingAdmin = await User.findOne({ email: ADMIN.email })
  if (existingAdmin) {
    logger.info(`Admin exists: ${ADMIN.email}`)
  } else {
    await User.create({ ...ADMIN, provider: 'local' })
    logger.info(`Created admin: ${ADMIN.email} / ${ADMIN.password}`)
  }

  await disconnectMongo()
  process.exit(0)
}

seed().catch((err) => {
  logger.error('Seed failed', err)
  process.exit(1)
})
