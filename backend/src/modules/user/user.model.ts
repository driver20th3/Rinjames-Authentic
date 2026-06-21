import mongoose, { Schema, Document, Types } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IAddress {
  _id?: Types.ObjectId
  label?: string
  street?: string
  city?: string
  isDefault: boolean
}

export interface IUser extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  password?: string
  phone?: string
  role: 'customer' | 'admin'
  provider: 'local' | 'facebook'
  facebookId?: string
  avatar?: string
  addresses: Types.DocumentArray<IAddress>
  refreshToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String },
    street: { type: String },
    city: { type: String },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
)

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Required only for local accounts (Facebook accounts have no password).
    password: {
      type: String,
      required: function (this: IUser) {
        return this.provider === 'local'
      }
    },
    phone: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    provider: { type: String, enum: ['local', 'facebook'], default: 'local' },
    facebookId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    addresses: { type: [AddressSchema], default: [] },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model<IUser>('User', UserSchema)
