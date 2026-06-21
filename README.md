# 🛍️ E-Commerce Shop Project

Dự án shop bán giày và quần áo với thanh toán chuyển khoản ngân hàng.

## 📁 Cấu trúc dự án

```
Rinjames-Authentic/
├── backend/          # Node.js + Express + TypeScript + MongoDB
├── frontend/         # Next.js 14 + TypeScript + Tailwind CSS
└── README.md
```

## 🚀 Quick Start

### Backend Setup

1. **Di chuyển vào thư mục backend:**
```bash
cd backend
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file .env:**
```bash
# Copy từ .env.example và điền thông tin
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shop
# hoặc MongoDB Atlas
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/shop

# JWT
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
FRONTEND_URL=http://localhost:3000
```

4. **Chạy server:**
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:5000`

### Frontend Setup

1. **Di chuyển vào thư mục frontend:**
```bash
cd frontend
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file .env.local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Chạy development server:**
```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

## 📝 Các bước tiếp theo

1. ✅ Setup Backend structure - **HOÀN THÀNH**
2. ✅ Setup Frontend structure - **HOÀN THÀNH**
3. ⏳ Tạo database models - **HOÀN THÀNH**
4. ⏳ Implement authentication - **HOÀN THÀNH**
5. ⏳ Implement products APIs - **HOÀN THÀNH**
6. ⏳ Implement cart functionality - **HOÀN THÀNH**
7. ⏳ Implement checkout flow - **HOÀN THÀNH**
8. ⏳ Implement admin panel - **HOÀN THÀNH**
9. ⏳ Setup Cloudinary for images - **ĐÃ CẤU HÌNH**
10. ⏳ Deploy to production - **CHƯA THỰC HIỆN**

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- Cloudinary (Image storage)
- JWT (Authentication)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Hook Form + Zod
- Axios

## 📚 API Endpoints

Xem chi tiết trong file `SHOP_PROJECT_SETUP.md`

## 🔐 Authentication Flow

1. User registers → Backend creates user with hashed password
2. User logs in → Backend validates credentials → Returns JWT token
3. Frontend stores token in localStorage
4. Each API request includes token in Authorization header
5. Backend middleware validates token

## 📦 Key Features

### Customer Features
- Browse products (filter, search, pagination)
- View product details
- Add to cart
- Checkout (enter shipping info)
- View bank account info for payment
- Upload payment proof (optional)
- View order status
- Order history

### Admin Features
- Manage products (CRUD)
- Manage categories
- Manage orders
- Confirm payment received
- Update order status (processing → shipped)
- Manage bank accounts
- View dashboard/analytics

## ⚠️ Important Notes

1. **Security**: Always hash passwords with bcrypt ✅
2. **Validation**: Validate all inputs on backend ✅
3. **Error Handling**: Implement proper error handling ✅
4. **Environment Variables**: Never commit .env files ✅
5. **CORS**: Configure CORS properly for production ✅
6. **Rate Limiting**: Consider adding rate limiting for API
7. **Image Optimization**: Use Cloudinary transformations for thumbnails
8. **Payment Proof**: Validate image uploads (type, size) ✅

## 📖 Documentation

Chi tiết kỹ thuật và hướng dẫn đầy đủ xem trong file `SHOP_PROJECT_SETUP.md`

---

**Happy Coding! 🚀**
