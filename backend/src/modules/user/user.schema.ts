import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().min(8).max(15).optional(),
  avatar: z.string().url().optional()
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(100)
})

export const addressSchema = z.object({
  label: z.string().max(40).optional(),
  street: z.string().max(200).optional(),
  city: z.string().max(80).optional(),
  isDefault: z.boolean().optional()
})

export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')
})
