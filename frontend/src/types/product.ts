export interface Product {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  salePrice?: number
  category: {
    _id: string
    name: string
    slug: string
  }
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
  createdAt: string
  updatedAt: string
}


