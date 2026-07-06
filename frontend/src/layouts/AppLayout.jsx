import { Outlet } from 'react-router-dom'

import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
      <Navbar />
      <main className="app-container flex-1 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
