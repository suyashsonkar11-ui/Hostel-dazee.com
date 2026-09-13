import { useState, useEffect } from 'react'

export function useRouter() {
  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/')

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const push = (url: string) => {
    window.history.pushState({}, '', url)
    setPath(url)
  }

  const replace = (url: string) => {
    window.history.replaceState({}, '', url)
    setPath(url)
  }

  return { path, push, replace }
}
