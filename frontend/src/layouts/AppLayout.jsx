import { Outlet } from 'react-router-dom'

import FooterPlaceholder from '@/components/layout/FooterPlaceholder'
import NavbarPlaceholder from '@/components/layout/NavbarPlaceholder'

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <NavbarPlaceholder />
      <main>
        <div className="app-container py-6">
          <Outlet />
        </div>
      </main>
      <FooterPlaceholder />
    </div>
  )
}
