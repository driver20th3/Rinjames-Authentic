'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getCategoryBySlug, getProducts } from '@/lib/api'
import { Category, Pagination, Product, SortOption } from '@/types'
import ProductCard from '@/components/ProductCard'

const SORTS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: thấp → cao' },
  { value: 'price-desc', label: 'Giá: cao → thấp' },
  { value: 'name', label: 'Tên A → Z' }
]

const LIMIT = 12

export default function CategoryPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Reset to page 1 when sort or category changes.
  useEffect(() => {
    setPage(1)
  }, [sort, slug])

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getCategoryBySlug(slug)
      .then((cat) => {
        setCategory(cat)
        return getProducts({ category: slug, sort, page, limit: LIMIT })
      })
      .then((res) => {
        if (!res) return
        setProducts(res.products)
        setPagination(res.pagination ?? null)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug, sort, page])

  if (notFound) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Không tìm thấy danh mục</h1>
        <p className="mt-2 text-neutral-500">Danh mục “{slug}” không tồn tại.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{category?.name ?? 'Đang tải…'}</h1>
          {category?.description && (
            <p className="mt-1 text-neutral-500">{category.description}</p>
          )}
          {pagination && (
            <p className="mt-1 text-sm text-neutral-400">{pagination.total} sản phẩm</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <span className="text-neutral-500">Sắp xếp:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="py-20 text-center text-neutral-500">Đang tải…</p>
      ) : products.length === 0 ? (
        <p className="py-20 text-center text-neutral-500">Chưa có sản phẩm trong danh mục này.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm disabled:opacity-40"
              >
                Trước
              </button>
              <span className="px-2 text-sm text-neutral-600">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
