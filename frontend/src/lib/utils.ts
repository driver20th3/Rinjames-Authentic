import { Product, Variant } from '@/types'

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Effective selling price (salePrice if present and lower). */
export function effectivePrice(p: Pick<Product, 'price' | 'salePrice'>): number {
  return p.salePrice && p.salePrice < p.price ? p.salePrice : p.price
}

export function discountPercent(p: Pick<Product, 'price' | 'salePrice'>): number | null {
  if (!p.salePrice || p.salePrice >= p.price) return null
  return Math.round((1 - p.salePrice / p.price) * 100)
}

/** Unique, sorted sizes available across a product's variants. */
export function availableSizes(variants: Variant[]): number[] {
  const sizes = variants.map((v) => v.size).filter((s): s is number => typeof s === 'number')
  return Array.from(new Set(sizes)).sort((a, b) => a - b)
}

/** Unique colors (name + hex) across variants. */
export function availableColors(variants: Variant[]): { color: string; colorHex?: string }[] {
  const seen = new Map<string, { color: string; colorHex?: string }>()
  for (const v of variants) {
    if (v.color && !seen.has(v.color)) seen.set(v.color, { color: v.color, colorHex: v.colorHex })
  }
  return Array.from(seen.values())
}

/**
 * Build a Facebook Messenger deep link with a prefilled message when the page
 * URL exposes a username (facebook.com/<username>); otherwise return the raw URL.
 */
export function messengerLink(facebookUrl: string, message: string): string {
  if (!facebookUrl) return ''
  const match = facebookUrl.match(/facebook\.com\/([^/?#]+)/i)
  const username = match?.[1]
  if (username && !/^profile\.php/i.test(username)) {
    return `https://m.me/${username}?text=${encodeURIComponent(message)}`
  }
  return facebookUrl
}

/** A ready-to-send order message for inbox-based ordering. */
export function orderMessage(product: Product): string {
  return `Xin chào, mình muốn đặt sản phẩm: ${product.name}. Sản phẩm còn hàng không ạ?`
}

