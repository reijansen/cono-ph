import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '@/layouts/AppLayout'
import AboutPage from '@/pages/AboutPage'
import BiomarkersPage from '@/pages/BiomarkersPage'
import ConopeptidesPage from '@/pages/ConopeptidesPage'
import HomePage from '@/pages/HomePage'
import PublicationsPage from '@/pages/PublicationsPage'
import SpeciesPage from '@/pages/SpeciesPage'
import VisualizationPage from '@/pages/VisualizationPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/species', element: <SpeciesPage /> },
      { path: '/conopeptides', element: <ConopeptidesPage /> },
      { path: '/biomarkers', element: <BiomarkersPage /> },
      { path: '/visualization', element: <VisualizationPage /> },
      { path: '/publications', element: <PublicationsPage /> },
    ],
  },
])
