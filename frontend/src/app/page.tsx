'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCategories, getProducts } from '@/lib/api'
import { Category, Product } from '@/types'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCategories(), getProducts({ featured: true, limit: 8 })])
      .then(([cats, { products }]) => {
        setCategories(cats)
        setFeatured(products)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-900 to-neutral-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            RinJames Authentic
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Giày · Quần áo · Túi chính hãng, tuyển chọn
          </h1>
          <p className="mt-4 max-w-xl text-neutral-300">
            Khám phá bộ sưu tập. Thích món nào, inbox Facebook/Instagram để đặt hàng nhanh chóng.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/danh-muc/${c.slug}`}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-amber-400"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold">Danh mục</h2>
        {categories.length === 0 ? (
          <p className="text-neutral-500">Chưa có danh mục.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold">Sản phẩm nổi bật</h2>
        {loading ? (
          <p className="text-neutral-500">Đang tải…</p>
        ) : featured.length === 0 ? (
          <p className="text-neutral-500">Chưa có sản phẩm nổi bật.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
