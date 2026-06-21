export interface OrderItem {
  product: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export interface ShippingAddress {
  name: string
  phone: string
  street: string
  city: string
  district: string
  ward: string
  postalCode?: string
}

export interface Order {
  _id: string
  orderNumber: string
  user: string
  items: OrderItem[]
  total: number
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  paymentMethod: string
  paymentStatus: 'pending' | 'confirmed' | 'failed'
  paymentProofImage?: string
  paymentConfirmedAt?: string
  paymentConfirmedBy?: string
  shippingAddress: ShippingAddress
  shippingStatus: 'pending' | 'shipped' | 'delivered'
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}


