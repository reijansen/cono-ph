import { useEffect, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import PrimaryNav from '@/components/layout/PrimaryNav'

const contactGmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=bioinformatics@pgc.up.edu.ph'

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
      <div className="app-container pt-3 sm:pt-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6 lg:items-start lg:pt-1">
          <NavLink
            to="/"
            end
            className="pl-1 py-1 text-[1.15rem] font-medium tracking-tight text-black sm:text-[1.3rem] lg:pl-2 lg:py-2.5 lg:text-[1.55rem]"
          >
            ConoPH
          </NavLink>

          <div className="hidden justify-center lg:flex">
            <PrimaryNav
              isSolid={isScrolled}
              className="fixed left-1/2 top-4 z-40 -translate-x-1/2 lg:top-5"
            />
          </div>

          <div className="flex items-center justify-end gap-3 py-1 lg:pr-2 lg:py-2.5">
            <div className="hidden lg:block">
              <Button as="a" href={contactGmailUrl} target="_blank" rel="noreferrer" variant="primary" size="sm">
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
          <div className="mt-3 rounded-[1.5rem] border border-black/5 bg-white/95 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.12)] backdrop-blur-xl lg:hidden">
            <div id="mobile-menu">
              <PrimaryNav
                className="w-full"
                isSolid
                mobile
              />
              <Button
                as="a"
                href={contactGmailUrl}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                size="sm"
                className="mt-3 w-full"
              >
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
