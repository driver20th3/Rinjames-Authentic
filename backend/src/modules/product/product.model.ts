import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IVariant {
  _id?: Types.ObjectId
  size?: number
  color?: string
  colorHex?: string
  stock: number
  sku?: string
}

export interface IProduct extends Document {
  _id: Types.ObjectId
  name: string
  slug: string
  brand?: string
  category: Types.ObjectId
  description?: string
  images: string[]
  variants: IVariant[]
  price: number
  salePrice?: number
  isActive: boolean
  isFeatured: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const VariantSchema = new Schema<IVariant>(
  {
    size: { type: Number },
    color: { type: String },
    colorHex: { type: String },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String }
  },
  { _id: true }
)

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    variants: { type: [VariantSchema], default: [] },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
)

ProductSchema.index({ name: 'text', brand: 'text' })
ProductSchema.index({ category: 1, isActive: 1 })
ProductSchema.index({ isFeatured: 1, isActive: 1 })
ProductSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true })

export default mongoose.model<IProduct>('Product', ProductSchema)
