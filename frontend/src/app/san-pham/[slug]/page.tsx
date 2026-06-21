'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram } from 'lucide-react'
import { getProductBySlug, getShopSocial } from '@/lib/api'
import { Product } from '@/types'
import {
  formatPrice,
  effectivePrice,
  discountPercent,
  availableSizes,
  availableColors,
  messengerLink,
  orderMessage
} from '@/lib/utils'

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [product, setProduct] = useState<Product | null>(null)
  const [social, setSocial] = useState<{ facebook: string; instagram: string }>({
    facebook: '',
    instagram: ''
  })
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getProductBySlug(slug)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
    getShopSocial()
      .then(setSocial)
      .catch(() => {})
  }, [slug])

  if (loading) {
    return <p className="py-20 text-center text-neutral-500">Đang tải…</p>
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
        <Link href="/" className="mt-4 inline-block text-amber-600 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    )
  }

  const price = effectivePrice(product)
  const discount = discountPercent(product)
  const sizes = availableSizes(product.variants)
  const colors = availableColors(product.variants)
  const category = typeof product.category === 'object' ? product.category : null
  const message = orderMessage(product)
  const fbLink = messengerLink(social.facebook, message)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-900">
          Trang chủ
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/danh-muc/${category.slug}`} className="hover:text-neutral-900">
              {category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            {product.images?.[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-300">
                Chưa có ảnh
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? 'border-amber-600' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <p className="text-sm uppercase tracking-wide text-neutral-400">{product.brand}</p>
          )}
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-neutral-900">{formatPrice(price)}</span>
            {discount && (
              <>
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-sm font-semibold text-amber-700">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-neutral-700">Size có sẵn</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <span
                    key={s}
                    className="flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border border-neutral-300 px-2 text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-neutral-700">Màu sắc</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <span
                    key={c.color}
                    className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
                  >
                    {c.colorHex && (
                      <span
                        className="h-4 w-4 rounded-full border border-neutral-300"
                        style={{ backgroundColor: c.colorHex }}
                      />
                    )}
                    {c.color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.description && (
            <div className="mt-6">
              <p className="mb-1 text-sm font-medium text-neutral-700">Mô tả</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                {product.description}
              </p>
            </div>
          )}

          {/* Order CTAs (inbox to order) */}
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-sm font-medium text-neutral-700">
              Thích sản phẩm này? Inbox để đặt hàng:
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {social.facebook && (
                <a
                  href={fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-5 py-3 font-medium text-white transition hover:opacity-90"
                >
                  <Facebook size={18} /> Đặt qua Facebook
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 font-medium text-white transition hover:opacity-90"
                >
                  <Instagram size={18} /> Đặt qua Instagram
                </a>
              )}
            </div>
            {!social.facebook && !social.instagram && (
              <p className="mt-2 text-xs text-neutral-400">
                Liên hệ cửa hàng để đặt hàng (chưa cấu hình link mạng xã hội).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
