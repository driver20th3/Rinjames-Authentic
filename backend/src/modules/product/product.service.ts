import { Types } from 'mongoose'
import Product from './product.model'
import Category from '../category/category.model'
import { generateSlug } from '../../shared/utils/slug'
import { buildPagination } from '../../shared/utils/response'
import { NotFoundError } from '../../shared/utils/errors'

const SORT_OPTIONS: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  name: { name: 1 }
}

export interface ProductFilters {
  category?: string
  brand?: string
  size?: number
  color?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  featured?: boolean
  sort?: string
  page: number
  limit: number
}

export interface AdminProductFilters extends ProductFilters {
  isActive?: boolean // admin can filter; public always sees only active
}

class ProductService {
  /** Accept a category slug or ObjectId; return its id, or null if unknown. */
  private async resolveCategoryId(category: string): Promise<Types.ObjectId | null> {
    if (Types.ObjectId.isValid(category)) return new Types.ObjectId(category)
    const found = await Category.findOne({ slug: category }).select('_id').lean()
    return found ? (found._id as Types.ObjectId) : null
  }

  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const base = generateSlug(name)
    const query: any = { slug: base }
    if (excludeId) query._id = { $ne: excludeId }
    const exists = await Product.findOne(query).select('_id').lean()
    return exists ? `${base}-${Date.now().toString().slice(-5)}` : base
  }

  /** Build the Mongo filter shared by public + admin listing. Returns null if the
   *  category filter references an unknown category (caller should return empty). */
  private async buildQuery(
    filters: AdminProductFilters,
    scope: 'public' | 'admin'
  ): Promise<Record<string, any> | null> {
    const { category, brand, size, color, minPrice, maxPrice, search, featured, isActive } = filters
    const query: any = {}

    if (scope === 'public') query.isActive = true
    else if (isActive !== undefined) query.isActive = isActive

    if (category) {
      const id = await this.resolveCategoryId(category)
      if (!id) return null
      query.category = id
    }
    if (brand) query.brand = brand
    if (size !== undefined) query['variants.size'] = size
    if (color) query['variants.color'] = color
    if (featured !== undefined) query.isFeatured = featured
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined) query.price.$gte = minPrice
      if (maxPrice !== undefined) query.price.$lte = maxPrice
    }
    if (search) query.$text = { $search: search }
    return query
  }

  private async runListing(query: Record<string, any>, sort: string | undefined, page: number, limit: number) {
    const skip = (page - 1) * limit
    const sortBy = (sort && SORT_OPTIONS[sort]) || SORT_OPTIONS.newest
    const [products, total] = await Promise.all([
      Product.find(query).populate('category', 'name slug').sort(sortBy).skip(skip).limit(limit).lean(),
      Product.countDocuments(query)
    ])
    return { products, pagination: buildPagination(page, limit, total) }
  }

  async list(filters: ProductFilters) {
    const query = await this.buildQuery(filters, 'public')
    if (!query) return { products: [], pagination: buildPagination(filters.page, filters.limit, 0) }
    return this.runListing(query, filters.sort, filters.page, filters.limit)
  }

  /** Admin listing — includes inactive products; supports filtering by isActive. */
  async listAdmin(filters: AdminProductFilters) {
    const query = await this.buildQuery(filters, 'admin')
    if (!query) return { products: [], pagination: buildPagination(filters.page, filters.limit, 0) }
    return this.runListing(query, filters.sort, filters.page, filters.limit)
  }

  /** Distinct brand names among active products (for filter UIs). */
  async getBrands(): Promise<string[]> {
    const brands: (string | null)[] = await Product.distinct('brand', { isActive: true })
    return brands.filter((b): b is string => !!b).sort((a, b) => a.localeCompare(b))
  }

  /** Other active products in the same category (excludes the given product). */
  async getRelated(slug: string, limit = 4) {
    const product = await Product.findOne({ slug }).select('_id category').lean()
    if (!product) throw new NotFoundError('Product not found')
    return Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
  }

  async getBySlug(slug: string) {
    const product = await Product.findOne({ slug }).populate('category', 'name slug')
    if (!product) throw new NotFoundError('Product not found')
    return product
  }

  async getById(id: string) {
    const product = await Product.findById(id).populate('category', 'name slug')
    if (!product) throw new NotFoundError('Product not found')
    return product
  }

  async create(data: any) {
    data.slug = await this.generateUniqueSlug(data.name)
    const product = await Product.create(data)
    return product
  }

  async update(id: string, data: any) {
    const product = await Product.findById(id)
    if (!product) throw new NotFoundError('Product not found')

    if (data.name && data.name !== product.name) {
      data.slug = await this.generateUniqueSlug(data.name, id)
    }
    Object.assign(product, data)
    await product.save()
    return product
  }

  async remove(id: string) {
    const product = await Product.findByIdAndDelete(id)
    if (!product) throw new NotFoundError('Product not found')
    return product
  }

  async addImages(id: string, urls: string[]) {
    const product = await Product.findByIdAndUpdate(
      id,
      { $push: { images: { $each: urls } } },
      { new: true }
    )
    if (!product) throw new NotFoundError('Product not found')
    return product
  }
}

export default new ProductService()
