import { Product } from './product'

export interface CartItem {
  _id: string
  product: Product
  quantity: number
  size?: string
  color?: string
}

export interface Cart {
  _id: string
  user: string
  items: CartItem[]
  updatedAt: string
}


