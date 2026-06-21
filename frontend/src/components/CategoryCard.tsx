import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/types'

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/danh-muc/${category.slug}`}
      className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl bg-neutral-900"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-70 transition duration-300 group-hover:scale-105 group-hover:opacity-60"
        />
      )}
      <div className="relative z-10 p-6">
        <h3 className="text-2xl font-bold text-white">{category.name}</h3>
        {category.description && (
          <p className="mt-1 text-sm text-neutral-200">{category.description}</p>
        )}
        <span className="mt-3 inline-block text-sm font-medium text-amber-300 group-hover:underline">
          Xem tất cả →
        </span>
      </div>
    </Link>
  )
}
