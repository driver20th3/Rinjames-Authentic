import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice, effectivePrice, discountPercent } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
  const price = effectivePrice(product)
  const discount = discountPercent(product)
  const image = product.images?.[0]

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-300">No image</div>
        )}
        {discount && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-600 px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-3">
        {product.brand && (
          <p className="text-xs uppercase tracking-wide text-neutral-400">{product.brand}</p>
        )}
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium text-neutral-800">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-neutral-900">{formatPrice(price)}</span>
          {discount && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
