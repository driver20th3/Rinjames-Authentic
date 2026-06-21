# 🛍️ E-Commerce Shop Project - Tech Stack & Setup Guide

## 📋 Tổng quan

Dự án shop bán giày và quần áo với thanh toán chuyển khoản ngân hàng.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand / React Query
- **Form Handling**: React Hook Form + Zod
- **Deployment**: Vercel

### Backend
- **Framework**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Image Storage**: Cloudinary
- **Authentication**: JWT
- **Deployment**: Railway / Render / AWS

### Database & Services
- **Database**: MongoDB (MongoDB Atlas)
- **Image Storage**: Cloudinary
- **Payment**: Chuyển khoản ngân hàng (không dùng payment gateway)
- **Email**: SendGrid / Resend (optional)

---

## 📁 Project Structure

```
shop-project/
├── frontend/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── (shop)/
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx          # Product listing
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx      # Product detail
│   │   │   │   ├── cart/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── checkout/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── orders/
│   │   │   │       └── page.tsx
│   │   │   ├── (admin)/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── products/
│   │   │   │   │   ├── orders/
│   │   │   │   │   └── dashboard/
│   │   │   │   └── layout.tsx
│   │   │   ├── api/                      # API client calls (optional)
│   │   │   │   └── products.ts
│   │   │   ├── layout.tsx                # Root layout
│   │   │   └── page.tsx                  # Home page
│   │   ├── components/
│   │   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductList.tsx
│   │   │   │   └── ProductFilters.tsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── CartSummary.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── ShippingForm.tsx
│   │   │   │   └── BankAccountInfo.tsx
│   │   │   └── admin/
│   │   │       ├── ProductForm.tsx
│   │   │       ├── OrderList.tsx
│   │   │       └── OrderDetail.tsx
│   │   ├── lib/
│   │   │   ├── api-client.ts             # Axios instance
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   ├── hooks/
│   │   │   ├── useCart.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useProducts.ts
│   │   ├── stores/                       # Zustand stores
│   │   │   ├── cartStore.ts
│   │   │   └── authStore.ts
│   │   └── types/
│   │       ├── product.ts
│   │       ├── order.ts
│   │       └── user.ts
│   ├── public/
│   │   └── images/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                              # Node.js + Express Backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── index.ts                  # Route aggregator
│   │   │   ├── products.route.ts
│   │   │   ├── orders.route.ts
│   │   │   ├── users.route.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── cart.route.ts
│   │   │   └── admin.route.ts
│   │   ├── controllers/
│   │   │   ├── products.controller.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── cart.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── services/
│   │   │   ├── products.service.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── users.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── cart.service.ts
│   │   │   └── admin.service.ts
│   │   ├── models/
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── User.ts
│   │   │   ├── Cart.ts
│   │   │   ├── BankAccount.ts
│   │   │   └── Category.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── upload.middleware.ts
│   │   ├── config/
│   │   │   ├── database.ts               # MongoDB connection
│   │   │   ├── cloudinary.ts             # Cloudinary setup
│   │   │   └── jwt.ts
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── errors.ts
│   │   │   └── helpers.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts                      # App entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
└── README.md
```

---

## 🗄️ Database Schema (MongoDB)

### Product Model
```typescript
{
  _id: ObjectId,
  name: String,                    // "Jeep Mary Jane Classic Grey"
  slug: String,                    // "jeep-mary-jane-classic-grey"
  description: String,
  price: Number,                   // 1450000
  salePrice: Number,               // Optional (khi có discount)
  category: ObjectId,              // Reference to Category
  brand: String,                   // "Jeep", "New Balance"
  images: [String],                // ["url1", "url2", ...]
  stock: Number,                   // Số lượng tồn kho
  attributes: {
    sizes: [String],               // ["36", "37", "38", "39", "40"]
    colors: [String],              // ["grey", "black", "white"]
    material: String,
    origin: String
  },
  status: String,                  // "active", "inactive", "out_of_stock"
  tags: [String],                  // ["bestseller", "new", "sale"]
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```typescript
{
  _id: ObjectId,
  name: String,                    // "Giày", "Quần áo"
  slug: String,                    // "giay", "quan-ao"
  parentId: ObjectId,              // Optional (for nested categories)
  description: String,
  image: String,                   // Category image
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```typescript
{
  _id: ObjectId,
  email: String,
  password: String,                // Hashed with bcrypt
  name: String,
  phone: String,
  role: String,                    // "customer", "admin"
  address: {
    street: String,
    city: String,
    district: String,
    ward: String,
    postalCode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```typescript
{
  _id: ObjectId,
  orderNumber: String,             // "ORD000001" (auto-generated)
  user: ObjectId,                  // Reference to User
  items: [{
    product: ObjectId,             // Reference to Product
    name: String,                  // Snapshot product name
    price: Number,                 // Snapshot price
    quantity: Number,
    size: String,
    color: String
  }],
  total: Number,
  status: String,                  // "pending_payment", "paid", "processing", "shipped", "completed", "cancelled"
  paymentMethod: String,           // "bank_transfer"
  paymentStatus: String,           // "pending", "confirmed", "failed"
  paymentProofImage: String,       // URL to proof image (if customer uploads)
  paymentConfirmedAt: Date,        // When admin confirms payment
  paymentConfirmedBy: ObjectId,    // Reference to Admin user
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    district: String,
    ward: String,
    postalCode: String
  },
  shippingStatus: String,          // "pending", "shipped", "delivered"
  trackingNumber: String,          // Optional
  notes: String,                   // Customer notes
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model (Optional - có thể dùng Redis hoặc localStorage)
```typescript
{
  _id: ObjectId,
  user: ObjectId,                  // Reference to User
  items: [{
    product: ObjectId,
    quantity: Number,
    size: String,
    color: String
  }],
  updatedAt: Date
}
```

### BankAccount Model
```typescript
{
  _id: ObjectId,
  bankName: String,                // "Vietcombank", "Vietinbank"
  accountNumber: String,
  accountHolder: String,
  branch: String,
  qrCodeImage: String,             // QR code image URL
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Products
```
GET    /api/products              # Get all products (with filters)
GET    /api/products/:id          # Get product by ID
GET    /api/products/category/:slug  # Get products by category
POST   /api/products              # Create product (Admin only)
PUT    /api/products/:id          # Update product (Admin only)
DELETE /api/products/:id          # Delete product (Admin only)
```

### Categories
```
GET    /api/categories            # Get all categories
GET    /api/categories/:id        # Get category by ID
POST   /api/categories            # Create category (Admin only)
```

### Cart
```
GET    /api/cart                  # Get user's cart
POST   /api/cart/add              # Add item to cart
PUT    /api/cart/update/:id       # Update cart item quantity
DELETE /api/cart/remove/:id       # Remove item from cart
DELETE /api/cart/clear            # Clear cart
```

### Orders
```
GET    /api/orders                # Get user's orders
GET    /api/orders/:id            # Get order by ID
POST   /api/orders                # Create order (checkout)
POST   /api/orders/:id/payment-proof  # Upload payment proof image
```

### Admin - Orders
```
GET    /api/admin/orders          # Get all orders (with filters)
GET    /api/admin/orders/:id      # Get order detail
PUT    /api/admin/orders/:id/confirm-payment  # Confirm payment
PUT    /api/admin/orders/:id/status           # Update order status
PUT    /api/admin/orders/:id/ship             # Mark as shipped
```

### Admin - Products
```
POST   /api/admin/products        # Create product
PUT    /api/admin/products/:id    # Update product
DELETE /api/admin/products/:id    # Delete product
```

### Bank Accounts
```
GET    /api/bank-accounts         # Get all active bank accounts (public)
POST   /api/admin/bank-accounts   # Create bank account (Admin only)
PUT    /api/admin/bank-accounts/:id  # Update bank account
DELETE /api/admin/bank-accounts/:id  # Delete bank account
```

### Auth
```
POST   /api/auth/register         # Register
POST   /api/auth/login            # Login
POST   /api/auth/logout           # Logout
GET    /api/auth/me               # Get current user
```

---

## 🔧 Setup Instructions

### 1. Backend Setup

#### Step 1: Create Backend Folder
```bash
mkdir backend
cd backend
```

#### Step 2: Initialize Project
```bash
npm init -y
```

#### Step 3: Install Dependencies
```bash
# Core dependencies
npm install express mongoose cors dotenv
npm install jsonwebtoken bcryptjs

# Image upload
npm install multer cloudinary

# Development dependencies
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/jsonwebtoken @types/bcryptjs @types/multer
npm install -D ts-node nodemon
```

#### Step 4: Setup TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

```json
// package.json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

```json
// nodemon.json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/index.ts",
  "ignore": ["src/**/*.spec.ts"]
}
```

#### Step 5: Environment Variables
```env
# .env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shop
# hoặc MongoDB Atlas
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/shop

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Step 6: Basic Server Setup
```typescript
// src/index.ts
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database'
import routes from './routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', routes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
```

```typescript
// src/config/database.ts
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
```

---

### 2. Frontend Setup

#### Step 1: Create Next.js App
```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
```

#### Step 2: Install Additional Dependencies
```bash
npm install axios zustand react-hook-form @hookform/resolvers zod
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react date-fns
```

#### Step 3: Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Step 4: API Client Setup
```typescript
// src/lib/api-client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push code lên GitHub
2. Connect Vercel với GitHub repo
3. Select folder `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

### Backend (Railway)

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Init project: `railway init`
4. Add environment variables trong Railway dashboard
5. Deploy: `railway up`

### Database (MongoDB Atlas)

1. Tạo account tại mongodb.com/cloud/atlas
2. Create cluster (Free tier)
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string
6. Update `MONGODB_URI` trong backend `.env`

---

## 📝 Code Examples

### Backend - Product Model
```typescript
// src/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  category: mongoose.Types.ObjectId
  brand: string
  images: string[]
  stock: number
  attributes: {
    sizes: string[]
    colors: string[]
    material?: string
    origin?: string
  }
  status: 'active' | 'inactive' | 'out_of_stock'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    attributes: {
      sizes: [{ type: String }],
      colors: [{ type: String }],
      material: { type: String },
      origin: { type: String }
    },
    status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
    tags: [{ type: String }]
  },
  { timestamps: true }
)

ProductSchema.index({ name: 'text', description: 'text' })
ProductSchema.index({ category: 1, status: 1 })

export default mongoose.model<IProduct>('Product', ProductSchema)
```

### Backend - Product Service
```typescript
// src/services/products.service.ts
import Product from '../models/Product'
import { Types } from 'mongoose'

class ProductsService {
  async getAllProducts(filters: {
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    search?: string
    page?: number
    limit?: number
  }) {
    const { category, brand, minPrice, maxPrice, search, page = 1, limit = 10 } = filters
    const skip = (page - 1) * limit

    const query: any = { status: 'active' }

    if (category) query.category = new Types.ObjectId(category)
    if (brand) query.brand = brand
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = minPrice
      if (maxPrice) query.price.$lte = maxPrice
    }
    if (search) {
      query.$text = { $search: search }
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getProductById(id: string) {
    const product = await Product.findById(id).populate('category', 'name slug')
    if (!product) {
      throw new Error('Product not found')
    }
    return product
  }

  async createProduct(data: any) {
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const product = new Product({ ...data, slug })
    await product.save()
    return product
  }
}

export default new ProductsService()
```

### Backend - Product Controller
```typescript
// src/controllers/products.controller.ts
import { Request, Response } from 'express'
import productsService from '../services/products.service'

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      brand: req.query.brand as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      search: req.query.search as string,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10
    }

    const result = await productsService.getAllProducts(filters)
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      result
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve products'
    })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productsService.getProductById(req.params.id)
    res.json({
      success: true,
      message: 'Product retrieved successfully',
      result: product
    })
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Product not found'
    })
  }
}
```

### Backend - Product Routes
```typescript
// src/routes/products.route.ts
import { Router } from 'express'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', requireAuth, requireAdmin, createProduct)
router.put('/:id', requireAuth, requireAdmin, updateProduct)
router.delete('/:id', requireAuth, requireAdmin, deleteProduct)

export default router
```

---

## 🔐 Authentication Flow

1. User registers → Backend creates user with hashed password
2. User logs in → Backend validates credentials → Returns JWT token
3. Frontend stores token in localStorage
4. Each API request includes token in Authorization header
5. Backend middleware validates token
6. If valid → Allow request
7. If invalid → Return 401, Frontend redirects to login

---

## 📦 Key Features

### Customer Features
- ✅ Browse products (filter, search, pagination)
- ✅ View product details
- ✅ Add to cart
- ✅ Checkout (enter shipping info)
- ✅ View bank account info for payment
- ✅ Upload payment proof (optional)
- ✅ View order status
- ✅ Order history

### Admin Features
- ✅ Manage products (CRUD)
- ✅ Manage categories
- ✅ Manage orders
- ✅ Confirm payment received
- ✅ Update order status (processing → shipped)
- ✅ Manage bank accounts
- ✅ View dashboard/analytics

---

## 🎯 Next Steps

1. ✅ Setup Backend structure
2. ✅ Setup Frontend structure
3. ✅ Create database models
4. ✅ Implement authentication
5. ✅ Implement products APIs
6. ✅ Implement cart functionality
7. ✅ Implement checkout flow
8. ✅ Implement admin panel
9. ✅ Setup Cloudinary for images
10. ✅ Deploy to production

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app/)

---

## ⚠️ Important Notes

1. **Security**: Always hash passwords with bcrypt
2. **Validation**: Validate all inputs on backend
3. **Error Handling**: Implement proper error handling
4. **Environment Variables**: Never commit .env files
5. **CORS**: Configure CORS properly for production
6. **Rate Limiting**: Consider adding rate limiting for API
7. **Image Optimization**: Use Cloudinary transformations for thumbnails
8. **Payment Proof**: Validate image uploads (type, size)

---

**Happy Coding! 🚀**

