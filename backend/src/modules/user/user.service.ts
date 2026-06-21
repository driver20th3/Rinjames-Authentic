import User from './user.model'
import { NotFoundError, BadRequestError, UnauthorizedError } from '../../shared/utils/errors'

interface AddressInput {
  label?: string
  street?: string
  city?: string
  isDefault?: boolean
}

class UserService {
  async getProfile(userId: string) {
    const user = await User.findById(userId).select('-password')
    if (!user) throw new NotFoundError('User not found')
    return user
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string; avatar?: string }) {
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true
    }).select('-password')
    if (!user) throw new NotFoundError('User not found')
    return user
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError('User not found')
    if (!user.password) {
      throw new BadRequestError('This account has no password (social login). Use reset password.')
    }
    const match = await user.comparePassword(currentPassword)
    if (!match) throw new UnauthorizedError('Current password is incorrect')

    user.password = newPassword
    user.refreshToken = undefined // log out other sessions
    await user.save()
    return { changed: true }
  }

  async addAddress(userId: string, address: AddressInput) {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError('User not found')

    if (address.isDefault) user.addresses.forEach((a) => (a.isDefault = false))
    // First address becomes default automatically.
    if (user.addresses.length === 0) address.isDefault = true

    user.addresses.push(address as any)
    await user.save()
    return user.addresses
  }

  async updateAddress(userId: string, addressId: string, data: AddressInput) {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError('User not found')

    const address = user.addresses.id(addressId)
    if (!address) throw new NotFoundError('Address not found')

    if (data.isDefault) user.addresses.forEach((a) => (a.isDefault = false))
    Object.assign(address, data)
    await user.save()
    return user.addresses
  }

  async deleteAddress(userId: string, addressId: string) {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError('User not found')

    const address = user.addresses.id(addressId)
    if (!address) throw new NotFoundError('Address not found')

    const wasDefault = address.isDefault
    address.deleteOne()
    // Promote a new default if we removed the default one.
    if (wasDefault && user.addresses.length > 0) user.addresses[0].isDefault = true
    await user.save()
    return user.addresses
  }
}

export default new UserService()
