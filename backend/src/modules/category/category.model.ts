import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ICategory extends Document {
  _id: Types.ObjectId
  name: string
  slug: string
  parentId?: Types.ObjectId
  description?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
    description: { type: String },
    image: { type: String }
  },
  { timestamps: true }
)

CategorySchema.index({ parentId: 1 })

export default mongoose.model<ICategory>('Category', CategorySchema)
