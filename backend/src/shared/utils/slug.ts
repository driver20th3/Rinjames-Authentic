/**
 * Generate a URL-friendly slug. Handles Vietnamese diacritics:
 *   "Giày Sneaker Nam" -> "giay-sneaker-nam"
 *   "Đầm dạ hội"       -> "dam-da-hoi"
 */
export const generateSlug = (text: string): string => {
  return text
    .normalize('NFD') // split accented chars into base + combining mark
    .replace(/[̀-ͯ]/g, '') // remove combining marks (Vietnamese tones)
    .replace(/đ/gi, 'd') // đ/Đ don't decompose, handle explicitly
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Order/SKU-style codes, e.g. ORD-20250621-4821 */
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `ORD${timestamp}${random}`
}
