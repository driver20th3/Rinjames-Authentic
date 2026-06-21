'use client'

import { useEffect, useState } from 'react'
import { Facebook, Instagram } from 'lucide-react'
import { getShopSocial } from '@/lib/api'

export default function Footer() {
  const [social, setSocial] = useState<{ facebook: string; instagram: string }>({
    facebook: '',
    instagram: ''
  })

  useEffect(() => {
    getShopSocial()
      .then(setSocial)
      .catch(() => {})
  }, [])

  return (
    <footer className="mt-20 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <p className="text-lg font-bold text-neutral-900">RinJames Authentic</p>
            <p className="mt-1 text-sm text-neutral-500">
              Giày · Quần áo · Túi — Inbox để đặt hàng
            </p>
          </div>

          <div className="flex gap-4">
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-amber-600"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            )}
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-amber-600"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            )}
          </div>

          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} RinJames Authentic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
