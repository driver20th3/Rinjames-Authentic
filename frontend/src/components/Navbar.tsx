'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { getCategories } from '@/lib/api'
import { Category } from '@/types'

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900">
          RinJames<span className="text-amber-600"> Authentic</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
            Trang chủ
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/danh-muc/${c.slug}`}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <div className="flex flex-col px-4 py-2">
            <Link href="/" className="py-2 text-neutral-700" onClick={() => setOpen(false)}>
              Trang chủ
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/danh-muc/${c.slug}`}
                className="py-2 text-neutral-700"
                onClick={() => setOpen(false)}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
