import {
  Database,
  Globe2,
  BarChart3,
  MapPinned,
  PieChart,
  Sprout,
} from 'lucide-react'
import visualizationMapPreview from '@/assets/map.png'

export const visualizationBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Visualization' },
]

export const visualizationMeta = {
  title: 'Data Visualization',
  subtitle:
    'Shared layout foundation for biodiversity, conopeptide, and biomarker visual summaries.',
}

export const visualizationMetrics = [
  {
    icon: Database,
    value: '127',
    label: 'Total Species',
    description: 'Mock summary label for the shared visualization shell.',
  },
  {
    icon: Sprout,
    value: '3,671',
    label: 'Conopeptide Precursors',
    description: 'Placeholder metric for future conopeptide analytics.',
  },
  {
    icon: Globe2,
    value: '312',
    label: 'Biomarkers',
    description: 'Placeholder metric for future biomarker analytics.',
  },
]

export const visualizationOverviewCards = [
  {
    id: 'species',
    title: '1. Species Overview',
    viewAllLabel: 'View all',
    viewAllTo: '/visualization/species',
    previewTitle: 'Species Distribution by Province',
    previewImage: visualizationMapPreview,
    previewAlt: 'Static preview of species distribution by province',
    listTitle: 'Top 5 Most Sequenced Species',
    listItems: [
      { name: 'Conus eburneus', value: '12' },
      { name: 'Conus imperialis', value: '10' },
      { name: 'Conus tessulatus', value: '8' },
      { name: 'Conus mustelinus', value: '7' },
      { name: 'Conus miles', value: '6' },
    ],
    ctaLabel: 'Explore Species',
    ctaTo: '/visualization/species',
    icon: MapPinned,
  },
  {
    id: 'conopeptides',
    title: '2. Conopeptide Overview',
    viewAllLabel: 'View all',
    viewAllTo: '/visualization/conopeptides',
    previewTitle: 'Conopeptide Superfamily Distribution',
    previewType: 'donut',
    secondaryTitle: 'Precursor Length Distribution',
    listTitle: 'Top Species',
    listItems: [
      { name: 'Conus eburneus', value: '12' },
      { name: 'Conus imperialis', value: '10' },
      { name: 'Conus tessulatus', value: '8' },
      { name: 'Conus mustelinus', value: '7' },
      { name: 'Conus miles', value: '6' },
    ],
    ctaLabel: 'Explore Conopeptides',
    ctaTo: '/visualization/conopeptides',
    icon: PieChart,
  },
  {
    id: 'biomarkers',
    title: '3. Biomarker Overview',
    viewAllLabel: 'View all',
    viewAllTo: '/visualization/biomarkers',
    previewTitle: 'Marker Type Distribution',
    previewType: 'donut',
    secondaryTitle: 'Species with Biomarker Coverage',
    listTitle: 'Top Species',
    listItems: [
      { name: 'Conus eburneus', value: '12' },
      { name: 'Conus imperialis', value: '10' },
      { name: 'Conus tessulatus', value: '8' },
      { name: 'Conus mustelinus', value: '7' },
      { name: 'Conus miles', value: '6' },
    ],
    ctaLabel: 'Explore Biomarkers',
    ctaTo: '/visualization/biomarkers',
    icon: BarChart3,
  },
]

export const visualizationInsights = [
  'High conopeptide diversity found in Conus geographus and Conus eburneus.',
  'M superfamily is the most prevalent across sequenced species.',
  'COI is the most widely used biomarker with 76% species coverage.',
]

export const visualizationFilterOptions = {
  project: ['All Projects', 'Project A', 'Project B', 'Project C'],
  subgenus: ['All Subgenera', 'Subgenus 1', 'Subgenus 2', 'Subgenus 3'],
  province: ['All Provinces', 'Province 1', 'Province 2', 'Province 3'],
  municipality: ['All Municipalities', 'Municipality 1', 'Municipality 2', 'Municipality 3'],
  sequencingPlatform: ['All Platforms', 'Illumina', 'Oxford Nanopore', 'PacBio'],
}

export const visualizationStatusOptions = ['Published', 'Under Review', 'Unpublished']
