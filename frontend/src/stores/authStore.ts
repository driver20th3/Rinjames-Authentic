import { create } from 'zustand'
import { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    set({ user, token })
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  },
  logout: () => {
    set({ user: null, token: null })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  },
  isAuthenticated: () => {
    return get().user !== null && get().token !== null
  },
  isAdmin: () => {
    return get().user?.role === 'admin'
  }
}))

