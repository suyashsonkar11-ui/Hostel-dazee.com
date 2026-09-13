import { useState, useEffect } from 'react'

const WISHLIST_KEY = 'dazee-wishlist'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      if (stored) setWishlist(JSON.parse(stored))
    } catch {}
  }, [])

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      return next
    })
  }

  const isWishlisted = (id: string) => wishlist.includes(id)

  return { wishlist, toggleWishlist, isWishlisted }
}
