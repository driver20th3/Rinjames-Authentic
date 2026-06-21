import { generateSlug, generateOrderNumber } from './slug'

describe('generateSlug', () => {
  it('handles Vietnamese diacritics', () => {
    expect(generateSlug('Giày')).toBe('giay')
    expect(generateSlug('Quần áo')).toBe('quan-ao')
    expect(generateSlug('Túi')).toBe('tui')
    expect(generateSlug('Đầm dạ hội')).toBe('dam-da-hoi')
  })

  it('lowercases and joins words with hyphens', () => {
    expect(generateSlug('Nike Air Force 1')).toBe('nike-air-force-1')
  })

  it('trims leading/trailing separators and collapses symbols', () => {
    expect(generateSlug('  Hello!!  World  ')).toBe('hello-world')
    expect(generateSlug('A / B & C')).toBe('a-b-c')
  })
})

describe('generateOrderNumber', () => {
  it('starts with ORD and is reasonably long', () => {
    const n = generateOrderNumber()
    expect(n.startsWith('ORD')).toBe(true)
    expect(n.length).toBeGreaterThanOrEqual(9)
  })
})
