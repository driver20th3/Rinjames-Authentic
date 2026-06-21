import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  phone: z.string().min(8).max(15).optional()
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
})

export const facebookSchema = z.object({
  accessToken: z.string().min(1, 'accessToken is required')
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1).optional()
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email')
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100)
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
