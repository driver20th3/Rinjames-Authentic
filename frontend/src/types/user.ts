export interface User {
  _id: string
  email: string
  name: string
  phone?: string
  role: 'customer' | 'admin'
  address?: {
    street?: string
    city?: string
    district?: string
    ward?: string
    postalCode?: string
  }
  createdAt: string
  updatedAt: string
}


