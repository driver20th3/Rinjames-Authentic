import Category from './category.model'
import { generateSlug } from '../../shared/utils/slug'
import { NotFoundError } from '../../shared/utils/errors'

class CategoryService {
  async list() {
    return Category.find().sort({ name: 1 }).lean()
  }

  async getById(id: string) {
    const category = await Category.findById(id)
    if (!category) throw new NotFoundError('Category not found')
    return category
  }

  async getBySlug(slug: string) {
    const category = await Category.findOne({ slug })
    if (!category) throw new NotFoundError('Category not found')
    return category
  }

  private async uniqueSlug(name: string, excludeId?: string): Promise<string> {
    const base = generateSlug(name)
    const query: any = { slug: base }
    if (excludeId) query._id = { $ne: excludeId }
    const exists = await Category.findOne(query).select('_id').lean()
    return exists ? `${base}-${Date.now().toString().slice(-5)}` : base
  }

  async create(data: any) {
    data.slug = await this.uniqueSlug(data.name)
    return Category.create(data)
  }

  async update(id: string, data: any) {
    const category = await Category.findById(id)
    if (!category) throw new NotFoundError('Category not found')

    if (data.name && data.name !== category.name) {
      data.slug = await this.uniqueSlug(data.name, id)
    }
    Object.assign(category, data)
    await category.save()
    return category
  }

  async remove(id: string) {
    const category = await Category.findByIdAndDelete(id)
    if (!category) throw new NotFoundError('Category not found')
    return category
  }
}

export default new CategoryService()
