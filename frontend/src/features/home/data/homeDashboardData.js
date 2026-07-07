export const homeMetrics = [
  {
    key: 'species-records',
    label: 'Species Records',
    value: '7,265',
    delta: '+184 this quarter',
    tone: 'indigo',
    detail: 'Curated occurrence records, taxonomy, and specimen-linked metadata.',
  },
  {
    key: 'conopeptides',
    label: 'Conopeptides',
    value: '3,671',
    delta: '+92 this quarter',
    tone: 'sky',
    detail: 'Annotated peptide entries with sequence, family, and publication links.',
  },
]

export const superfamilyBreakdown = [
  { label: 'A', value: 58, color: '#8ab4f8' },
  { label: 'M', value: 100, color: '#5fd0c1' },
  { label: '01', value: 72, color: '#111827' },
  { label: '02', value: 96, color: '#6fb0ff' },
  { label: 'T', value: 46, color: '#b79be8' },
  { label: 'Unknown', value: 88, color: '#71d57d' },
]

export const specimenDistribution = [
  { label: 'Luzon', value: 52.1, color: '#111827' },
  { label: 'Visayas', value: 22.8, color: '#8ab4f8' },
  { label: 'Mindanao', value: 13.9, color: '#a8e6cf' },
  { label: 'Unknown', value: 11.2, color: '#c7d4f3' },
]

export const discoveryTrend = [
  { year: '2016', value: 18 },
  { year: '2017', value: 24 },
  { year: '2018', value: 22 },
  { year: '2019', value: 28 },
  { year: '2020', value: 33 },
  { year: '2021', value: 44 },
  { year: '2022', value: 61 },
  { year: '2023', value: 72 },
  { year: '2024', value: 79 },
  { year: '2025', value: 86 },
]

export const recentPublications = [
  {
    id: 'PUB-2025-014',
    title: 'New cone snail transcriptomes expand Philippine conopeptide diversity',
    journal: 'Marine Genomics',
    publicationDate: '2025-05-18',
    authors: 'Dela Cruz, Santos, and Reyes',
    badge: 'Transcriptomics',
  },
  {
    id: 'PUB-2025-011',
    title: 'Integrative taxonomy reveals cryptic Conus lineages in the Visayas',
    journal: 'Systematics and Biodiversity',
    publicationDate: '2025-03-26',
    authors: 'Mendoza, Lim, and Garcia',
    badge: 'Taxonomy',
  },
  {
    id: 'PUB-2024-097',
    title: 'A regional inventory of Philippine cone snail peptide families',
    journal: 'Frontiers in Marine Science',
    publicationDate: '2024-11-09',
    authors: 'Ramos, Bautista, and Cruz',
    badge: 'Inventory',
  },
]

export const recentSpecies = [
  {
    id: 'SPC-2025-004',
    name: 'Conus aurorae',
    publicationDate: '2025-05-18',
    locality: 'Northern Samar',
    status: 'Newly curated',
  },
  {
    id: 'SPC-2025-003',
    name: 'Conus visayanus',
    publicationDate: '2025-03-26',
    locality: 'Bohol Strait',
    status: 'Recent record',
  },
  {
    id: 'SPC-2024-058',
    name: 'Conus palawanensis',
    publicationDate: '2024-11-09',
    locality: 'Palawan Shelf',
    status: 'Validated',
  },
]

export const databaseUpdates = [
  {
    id: 'UPD-01',
    type: 'Species',
    title: '3 species newly added to the curated list',
    detail: 'Records imported from the latest literature screening and validation pass.',
    date: '2025-05-18',
  },
  {
    id: 'UPD-02',
    type: 'Sequences',
    title: '112 peptide sequences annotated',
    detail: 'Sequence metadata now links peptide names, families, and source publications.',
    date: '2025-04-30',
  },
  {
    id: 'UPD-03',
    type: 'Publications',
    title: '3 publications indexed for the current release',
    detail: 'Recent articles were normalized with authors, journal, and publication date fields.',
    date: '2025-03-26',
  },
  {
    id: 'UPD-04',
    type: 'Records',
    title: '184 specimen records refreshed',
    detail: 'Occurrence and locality metadata were aligned with the latest curated dataset.',
    date: '2025-02-12',
  },
]

export const dashboardViews = [
  { value: 'overview', label: 'Overview' },
  { value: 'publications', label: 'Publications' },
  { value: 'species', label: 'Species' },
  { value: 'updates', label: 'Updates' },
]
