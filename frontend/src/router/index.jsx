import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '@/layouts/AppLayout'
import AboutPage from '@/pages/AboutPage'
import BiomarkerDetailPage from '@/pages/BiomarkerDetailPage'
import BiomarkersPage from '@/pages/BiomarkersPage'
import ConopeptidesPage from '@/pages/ConopeptidesPage'
import ConopeptideDetailPage from '@/pages/ConopeptideDetailPage'
import HomePage from '@/pages/HomePage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AdminLoginPage from '@/pages/AdminLoginPage'
import PublicationsPage from '@/pages/PublicationsPage'
import SpeciesDetailPage from '@/pages/SpeciesDetailPage'
import SpeciesPage from '@/pages/SpeciesPage'
import VisualizationPage from '@/pages/VisualizationPage'
import BiomarkerOverviewPage from '@/features/visualization/pages/BiomarkerOverviewPage'
import ConopeptideOverviewPage from '@/features/visualization/pages/ConopeptideOverviewPage'
import SpeciesOverviewPage from '@/features/visualization/pages/SpeciesOverviewPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/adminlogin', element: <AdminLoginPage /> },
      { path: '/admin', element: <AdminDashboardPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/species', element: <SpeciesPage /> },
      { path: '/species/:speciesId', element: <SpeciesDetailPage /> },
      { path: '/conopeptides', element: <ConopeptidesPage /> },
      { path: '/conopeptides/:id', element: <ConopeptideDetailPage /> },
      { path: '/biomarkers', element: <BiomarkersPage /> },
      { path: '/biomarkers/:id', element: <BiomarkerDetailPage /> },
      { path: '/visualization', element: <VisualizationPage /> },
      { path: '/visualization/species', element: <SpeciesOverviewPage /> },
      { path: '/visualization/conopeptides', element: <ConopeptideOverviewPage /> },
      { path: '/visualization/biomarkers', element: <BiomarkerOverviewPage /> },
      { path: '/publications', element: <PublicationsPage /> },
    ],
  },
])
