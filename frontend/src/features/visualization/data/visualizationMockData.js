import {
  Database,
  FileCheck2,
  Globe2,
  BarChart3,
  Layers3,
  MapPinned,
  PieChart,
  Sprout,
} from 'lucide-react'
import visualizationMapPreview from '@/assets/map.png'

export { visualizationMapPreview }

export const visualizationBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Visualization' },
]

export const visualizationMeta = {
  title: 'Data Visualization',
  subtitle:
    'Explore Philippine cone snail biodiversity, conopeptide diversity, and biomarker coverage through interactive visual summaries.',
  primaryCtaLabel: 'Explore Species Overview',
  primaryCtaTo: '/visualization/species',
}

export const visualizationMetrics = [
  {
    icon: Database,
    value: '127',
    label: 'Total Species',
    description: 'Across 24 subgenera and 56 provinces.',
  },
  {
    icon: Sprout,
    value: '3,671',
    label: 'Conopeptide Precursors',
    description: 'From 67 superfamilies and 1,248 unique peptides.',
  },
  {
    icon: BarChart3,
    value: '312',
    label: 'Biomarkers',
    description: '18 marker types across 245 species.',
  },
  {
    icon: FileCheck2,
    value: '76%',
    label: 'Biomarker Coverage',
    description: 'Species with at least one biomarker recorded.',
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

export const conopeptideOverviewBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Visualization', to: '/visualization' },
  { label: 'Conopeptides' },
]

export const conopeptideOverviewMeta = {
  title: 'Conopeptide Overview',
  subtitle: 'Analyze conopeptide diversity, superfamilies, and sequence characteristics.',
}

export const conopeptideOverviewMetrics = [
  {
    icon: Database,
    value: '3,671',
    label: 'Total Precursors',
  },
  {
    icon: Sprout,
    value: '67',
    label: 'Superfamilies',
  },
  {
    icon: Globe2,
    value: '1,248',
    label: 'Unique Peptides',
  },
  {
    icon: FileCheck2,
    value: '56',
    label: 'Species with Conopeptides',
  },
]

export const conopeptideSuperfamilyLegend = [
  { label: 'A', count: 648, percent: '52.1%', color: 'bg-slate-900' },
  { label: 'M', count: 284, percent: '22.8%', color: 'bg-[#9eb8e8]' },
  { label: 'O1', count: 173, percent: '13.9%', color: 'bg-[#8be2b2]' },
  { label: 'O2', count: 72, percent: '5.8%', color: 'bg-[#df9ee9]' },
  { label: 'T', count: 39, percent: '3.1%', color: 'bg-[#aac0e4]' },
  { label: 'Unknown', count: 32, percent: '2.5%', color: 'bg-brand-200' },
]

export const conopeptideLengthBins = [
  { label: '40-60 aa', value: 22 },
  { label: '61-80 aa', value: 36 },
  { label: '81-100 aa', value: 45 },
  { label: '101-120 aa', value: 38 },
  { label: '121-140 aa', value: 26 },
  { label: '141+ aa', value: 14 },
]

export const conopeptideTopAbundantRows = [
  {
    name: 'Conantokin-T',
    superfamily: 'M',
    framework: 'C-C-CC',
    count: 42,
    species: 'Conus geographus, Conus eburneus',
  },
  {
    name: 'Conantokin-G',
    superfamily: 'M',
    framework: 'C-C-CC',
    count: 38,
    species: 'Conus geographus, Conus imperialis',
  },
  {
    name: 'Contulakin-G',
    superfamily: 'O1',
    framework: 'CC-C-C',
    count: 31,
    species: 'Conus textile, Conus miles',
  },
  {
    name: 'Conotoxin KIIIA',
    superfamily: 'A',
    framework: 'CC-C-C-C',
    count: 29,
    species: 'Conus magus, Conus tribblei',
  },
  {
    name: 'Conotoxin GVIA',
    superfamily: 'A',
    framework: 'CC-C-C',
    count: 25,
    species: 'Conus geographus, Conus tulipa',
  },
  {
    name: 'Conotoxin MVIIA',
    superfamily: 'A',
    framework: 'CC-C-C',
    count: 22,
    species: 'Conus magus, Conus catus',
  },
  {
    name: 'Conantokin-R',
    superfamily: 'M',
    framework: 'C-C-CC',
    count: 20,
    species: 'Conus radiatus, Conus eburneus',
  },
  {
    name: 'Conus peptide 1',
    superfamily: 'Unknown',
    framework: 'C-X-C',
    count: 18,
    species: 'Conus rolani, Conus miles',
  },
  {
    name: 'Conotoxin PnIA',
    superfamily: 'O2',
    framework: 'CC-C-C',
    count: 17,
    species: 'Conus pennaceus, Conus imperialis',
  },
  {
    name: 'Conotoxin SxVIIA',
    superfamily: 'T',
    framework: 'C-C-C',
    count: 15,
    species: 'Conus striatus, Conus tessulatus',
  },
]

export const biomarkerOverviewBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Visualization', to: '/visualization' },
  { label: 'Biomarkers' },
]

export const biomarkerOverviewMeta = {
  title: 'Biomarker Overview',
  subtitle:
    'Explore biomarker coverage, marker diversity, and sequencing completeness across Philippine cone snail species.',
}

export const biomarkerOverviewMetrics = [
  {
    icon: Database,
    value: '312',
    label: 'Total Biomarkers',
  },
  {
    icon: Sprout,
    value: '18',
    label: 'Biomarker Types',
  },
  {
    icon: FileCheck2,
    value: '245',
    label: 'Species with Biomarker Data',
  },
  {
    icon: Globe2,
    value: '76%',
    label: 'Biomarker Coverage',
  },
]

export const biomarkerTypeLegend = [
  { label: 'COI', count: 98, percent: '31.4%', color: 'bg-slate-900' },
  { label: '16S', count: 72, percent: '23.1%', color: 'bg-[#9eb8e8]' },
  { label: '12S', count: 56, percent: '17.9%', color: 'bg-[#8be2b2]' },
  { label: 'H3', count: 41, percent: '13.1%', color: 'bg-[#df9ee9]' },
  { label: 'ITS', count: 29, percent: '9.3%', color: 'bg-[#aac0e4]' },
  { label: 'Other', count: 16, percent: '5.2%', color: 'bg-brand-200' },
]

export const biomarkerCoverageData = [
  { label: 'Species with biomarker data', value: 76 },
  { label: 'Species without biomarker data', value: 24 },
]

export const biomarkerDensityByProvince = [
  { label: 'Cebu', value: 98 },
  { label: 'Batangas', value: 85 },
  { label: 'Palawan', value: 64 },
  { label: 'Bohol', value: 47 },
  { label: 'Negros Occidental', value: 43 },
]

export const biomarkerSummaryRows = [
  {
    biomarkerId: 'BIOM-001',
    markerType: 'COI',
    species: 'Conus eburneus',
    accession: 'MN908441',
    sequenceLength: '658 bp',
    province: 'Cebu',
  },
  {
    biomarkerId: 'BIOM-002',
    markerType: '16S',
    species: 'Conus imperialis',
    accession: 'MN908442',
    sequenceLength: '571 bp',
    province: 'Batangas',
  },
  {
    biomarkerId: 'BIOM-003',
    markerType: 'H3',
    species: 'Conus tessulatus',
    accession: 'MN908443',
    sequenceLength: '328 bp',
    province: 'Palawan',
  },
  {
    biomarkerId: 'BIOM-004',
    markerType: 'ITS',
    species: 'Conus mustelinus',
    accession: 'MN908444',
    sequenceLength: '489 bp',
    province: 'Bohol',
  },
  {
    biomarkerId: 'BIOM-005',
    markerType: '12S',
    species: 'Conus miles',
    accession: 'MN908445',
    sequenceLength: '412 bp',
    province: 'Negros Occidental',
  },
]

export const speciesOverviewBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Visualization', to: '/visualization' },
  { label: 'Species' },
]

export const speciesOverviewMeta = {
  title: 'Species Overview',
  subtitle: 'Explore species diversity, distribution, and sequencing coverage.',
}

export const speciesOverviewMetrics = [
  {
    icon: Database,
    value: '127',
    label: 'Total Species',
  },
  {
    icon: Layers3,
    value: '24',
    label: 'Subgenera',
  },
  {
    icon: MapPinned,
    value: '82',
    label: 'Provinces',
  },
  {
    icon: FileCheck2,
    value: '127',
    label: 'Species with Sequence Data',
  },
]

export const speciesProvinceLegend = [
  { label: '> 20 species', color: 'bg-[#f0c4cf]' },
  { label: '11 - 20 species', color: 'bg-[#9dd6f4]' },
  { label: '6 - 10 species', color: 'bg-[#80e72a]' },
  { label: '1 - 5 species', color: 'bg-[#dea0ef]' },
  { label: '0 species', color: 'bg-[#b8cbea]' },
]

export const speciesTopSequencedSpecies = [
  { name: 'Conus eburneus', value: 12 },
  { name: 'Conus imperialis', value: 10 },
  { name: 'Conus tessulatus', value: 8 },
  { name: 'Conus mustelinus', value: 7 },
  { name: 'Conus miles', value: 6 },
  { name: 'Conus capitaneus', value: 6 },
  { name: 'Conus magus', value: 5 },
  { name: 'Conus striolatus', value: 5 },
  { name: 'Conus rolani', value: 5 },
  { name: 'Conus tribblei', value: 4 },
]

export const speciesSubgenusLegend = [
  { label: 'Tesseliconus', color: 'bg-slate-900' },
  { label: 'Stephanoconus', color: 'bg-[#9db6df]' },
  { label: 'Rhizoconus', color: 'bg-[#90e0ac]' },
  { label: 'Pionoconus', color: 'bg-[#df9ee9]' },
  { label: 'Other', color: 'bg-[#aac0e4]' },
]

export const speciesSubgenusChartData = [
  { name: 'Pionoconus', value: 4 },
  { name: 'Tesseliconus', value: 3 },
  { name: 'Rhizoconus', value: 3 },
  { name: 'Splinoconus', value: 3 },
  { name: 'Other', value: 6 },
]

export const speciesProvinceCoverage = [
  { label: 'A', value: 64 },
  { label: 'B', value: 80 },
  { label: 'C', value: 40 },
  { label: 'D', value: 50 },
  { label: 'E', value: 64 },
  { label: 'F', value: 24 },
  { label: 'G', value: 90 },
  { label: 'H', value: 64 },
]
