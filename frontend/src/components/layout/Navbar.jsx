import { useEffect, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import PrimaryNav from '@/components/layout/PrimaryNav'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="relative z-30">
      <div className="app-container pt-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <NavLink
            to="/"
            end
            className="text-[1.35rem] font-medium tracking-tight text-black lg:text-[1.55rem]"
          >
            ConoPH
          </NavLink>

          <div className="flex justify-center">
            <PrimaryNav
              isSolid={isScrolled}
              className="fixed left-1/2 top-4 z-40 w-[min(860px,calc(100vw-1rem))] -translate-x-1/2 lg:top-5 lg:w-[min(860px,calc(100vw-4rem))]"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden lg:block">
              <Button as="a" href="/#contact" variant="primary" size="sm">
                Contact Us
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="mt-3 rounded-[2rem] border border-black/5 bg-white/85 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.12)] backdrop-blur-xl lg:hidden">
            <div id="mobile-menu">
              <PrimaryNav
                className="w-full rounded-[1.5rem] bg-brand-50 px-4 py-4"
                isSolid
              />
              <Button as="a" href="/#contact" variant="primary" size="sm" className="mt-3 w-full">
                Contact Us
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
