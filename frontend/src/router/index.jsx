import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '@/layouts/AppLayout'
import AboutPage from '@/pages/AboutPage'
import BiomarkersPage from '@/pages/BiomarkersPage'
import RoutePlaceholder from '@/components/common/RoutePlaceholder'
import ConopeptidesPage from '@/pages/ConopeptidesPage'
import HomePage from '@/pages/HomePage'
import PublicationsPage from '@/pages/PublicationsPage'
import SpeciesDetailPage from '@/pages/SpeciesDetailPage'
import SpeciesPage from '@/pages/SpeciesPage'
import VisualizationPage from '@/pages/VisualizationPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/species', element: <SpeciesPage /> },
      { path: '/species/:speciesId', element: <SpeciesDetailPage /> },
      { path: '/conopeptides', element: <ConopeptidesPage /> },
      { path: '/biomarkers', element: <BiomarkersPage /> },
      { path: '/visualization', element: <VisualizationPage /> },
      { path: '/visualization/species', element: <RoutePlaceholder title="Visualization / Species" /> },
      {
        path: '/visualization/conopeptides',
        element: <RoutePlaceholder title="Visualization / Conopeptides" />,
      },
      {
        path: '/visualization/biomarkers',
        element: <RoutePlaceholder title="Visualization / Biomarkers" />,
      },
      { path: '/publications', element: <PublicationsPage /> },
    ],
  },
])
