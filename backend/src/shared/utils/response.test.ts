import { buildPagination } from './response'

describe('buildPagination', () => {
  it('computes totalPages by ceiling', () => {
    expect(buildPagination(1, 10, 25)).toEqual({ page: 1, limit: 10, total: 25, totalPages: 3 })
    expect(buildPagination(2, 12, 12)).toEqual({ page: 2, limit: 12, total: 12, totalPages: 1 })
  })

  it('returns 0 totalPages when there are no items', () => {
    expect(buildPagination(1, 10, 0).totalPages).toBe(0)
  })
})
