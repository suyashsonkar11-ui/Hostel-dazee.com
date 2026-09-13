import { useState } from 'react'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dazee-wishlist') || '[]')
    } catch {
      return []
    }
  })

  const toggleWishlist = (id: string) => {
    const next = wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [...wishlist, id]
    setWishlist(next)
    localStorage.setItem('dazee-wishlist', JSON.stringify(next))
  }

  const isSaved = (id: string) => wishlist.includes(id)

  return { wishlist, toggleWishlist, isSaved }
}
