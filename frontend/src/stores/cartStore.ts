import { create } from 'zustand'
import { CartItem } from '@/types/cart'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.product._id === item.product._id && i.size === item.size && i.color === item.color
      )
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i._id === existingItem._id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        }
      }
      return { items: [...state.items, item] }
    })
  },
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item._id !== itemId)
    }))
  },
  updateQuantity: (itemId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    }))
  },
  clearCart: () => {
    set({ items: [] })
  },
  getTotal: () => {
    return get().items.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price
      return total + price * item.quantity
    }, 0)
  },
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0)
  }
}))

