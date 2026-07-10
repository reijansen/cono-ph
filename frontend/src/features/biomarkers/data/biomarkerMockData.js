import { Database, Dna, FileCheck2, MapPinned } from 'lucide-react'

export const biomarkerExplorerBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Biomarkers' },
]

export const biomarkerExplorerMeta = {
  title: 'Biomarkers Explorer',
  subtitle:
    'Explore biomarker records, marker types, and linked sequence evidence from Philippine cone snails.',
}

export const biomarkerExplorerMetrics = [
  {
    icon: Database,
    value: '312',
    label: 'Total Biomarkers',
    description: 'Curated biomarker records across linked species and projects.',
  },
  {
    icon: Dna,
    value: '18',
    label: 'Marker Types',
    description: 'Distinct molecular marker categories represented in the dataset.',
  },
  {
    icon: FileCheck2,
    value: '245',
    label: 'Species with Data',
    description: 'Species entries with at least one biomarker-associated record.',
  },
  {
    icon: MapPinned,
    value: '56',
    label: 'Provinces Covered',
    description: 'Collection localities represented in the current mock dataset.',
  },
]

export const biomarkerFilterOptions = {
  project: ['All Projects', 'ConoPH Core', 'Barcode Survey', 'Museum Reference Set'],
  markerType: ['All Marker Types', 'COI', '16S rRNA', '12S rRNA', 'H3', 'ITS', '28S rRNA'],
  species: ['All Species', 'Conus eburneus', 'Conus imperialis', 'Conus tessulatus', 'Conus miles'],
  province: ['All Provinces', 'Cebu', 'Bohol', 'Batangas', 'Palawan', 'Negros Occidental'],
  municipality: ['All Municipalities', 'Oslob', 'Moalboal', 'Loay', 'Puerto Princesa', 'Dumaguete'],
  status: ['Published', 'Under Review', 'Unpublished'],
  sequencingPlatform: ['All Platforms', 'Illumina MiSeq', 'Illumina NovaSeq 6000', 'Sanger'],
}

export const biomarkerExplorerRows = [
  {
    biomarkerId: 'BMK0001',
    markerType: 'COI',
    species: 'Conus eburneus',
    accession: 'ON123456',
    sequenceLength: '658 bp',
    province: 'Cebu',
    status: 'Published',
  },
  {
    biomarkerId: 'BMK0002',
    markerType: '16S rRNA',
    species: 'Conus imperialis',
    accession: 'ON123457',
    sequenceLength: '512 bp',
    province: 'Cebu',
    status: 'Published',
  },
  {
    biomarkerId: 'BMK0003',
    markerType: 'ITS',
    species: 'Conus tessulatus',
    accession: 'ON123458',
    sequenceLength: '703 bp',
    province: 'Palawan',
    status: 'Under Review',
  },
  {
    biomarkerId: 'BMK0004',
    markerType: 'H3',
    species: 'Conus miles',
    accession: 'Unavailable',
    sequenceLength: '328 bp',
    province: 'Bohol',
    status: 'Published',
  },
  {
    biomarkerId: 'BMK0005',
    markerType: '12S rRNA',
    species: 'Conus capitaneus',
    accession: 'ON123459',
    sequenceLength: '421 bp',
    province: 'Batangas',
    status: 'Unpublished',
  },
]

export const biomarkerPagination = {
  page: 1,
  totalPages: 24,
}

export const biomarkerDetailFieldGroups = {
  overview: ['Biomarker ID', 'Marker Type', 'Species', 'Accession Number'],
  sequence: ['Sequence', 'Sequence Length', 'Sequencing Platform'],
  annotations: ['Validation Status', 'Coverage Note', 'Linked Publication'],
  metadata: ['Project', 'Province', 'Municipality', 'Collection Date'],
}
