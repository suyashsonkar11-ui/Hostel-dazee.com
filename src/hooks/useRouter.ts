import { useEffect, useState } from 'react'

export function useRouter() {
  const [pathname, setPathname] = useState(typeof window !== 'undefined' ? window.location.pathname : '/')

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const push = (path: string) => {
    window.history.pushState({}, '', path)
    setPathname(path)
  }

  const replace = (path: string) => {
    window.history.replaceState({}, '', path)
    setPathname(path)
  }

  return { pathname, push, replace }
}
