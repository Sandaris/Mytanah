import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ChromeContext = createContext(null)

function isValuationPath(pathname) {
  return pathname === '/dashboard' || pathname === '/dashboard/'
}

export function ChromeProvider({ children }) {
  const { pathname } = useLocation()
  const isMapPage = isValuationPath(pathname)
  const [chromeShown, setChromeShown] = useState(!isMapPage)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    if (!isValuationPath(pathname)) setChromeShown(true)
  }, [pathname])

  const engage = () => setChromeShown(true)

  return (
    <ChromeContext.Provider value={{ chromeShown, engage, navOpen, setNavOpen, isMapPage }}>
      {children}
    </ChromeContext.Provider>
  )
}

export function useChrome() {
  const ctx = useContext(ChromeContext)
  if (!ctx) throw new Error('useChrome must be used within ChromeProvider')
  return ctx
}
