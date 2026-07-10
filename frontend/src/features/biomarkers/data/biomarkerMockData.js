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

export const biomarkerDetailRecords = [
  {
    biomarkerId: 'BMK0001',
    title: 'BMK0001',
    subtitle: 'Biomarker Record',
    status: 'Published',
    topSummaryItems: [
      { label: 'Marker Type', value: 'COI' },
      { label: 'Species', value: 'Conus eburneus' },
      { label: 'Accession Number', value: 'ON123456' },
      { label: 'Sequence Length', value: '658 bp' },
      { label: 'Province', value: 'Cebu' },
      { label: 'Data Status', value: 'Published' },
    ],
    tabs: ['Overview', 'Sequence', 'Annotations', 'Metadata'],
    overview: {
      note: 'Mitochondrial COI barcode record used as a representative biomarker entry for species-level comparison and geographic coverage review.',
      description:
        'This mock record summarizes a barcode-style biomarker entry linked to a Philippine cone snail specimen and associated locality metadata.',
      fields: [
        { label: 'Marker Type', value: 'COI' },
        { label: 'Species', value: 'Conus eburneus' },
        { label: 'Accession Number', value: 'ON123456' },
        { label: 'Sequence Length', value: '658 bp' },
        { label: 'Province', value: 'Cebu' },
        { label: 'Municipality', value: 'Oslob' },
        { label: 'Project', value: 'Barcode Survey' },
        { label: 'Sequencing Platform', value: 'Illumina MiSeq' },
      ],
      reference: {
        title: 'Linked Publication',
        citation: 'Santos, M.L., Reyes, P.J., and Cruz, A.D. (2025). Philippine cone snail barcodes for regional biodiversity assessment.',
        actionLabel: 'View in Reference',
      },
    },
    sequenceTab: {
      sequence:
        'ATGACTAATCCTGCTTCTACTACTCTTCTACTGCTACTGGTATCGGTACTGGTAACTGGTGCTTCTGCTACTAATGCTGCTACTGCTAACGGTTACTTCTGGTGCTACTGCTGCTGGTTACTACTGCTGGTGCTTCTAATGGTGCTACTGCTACTGGTAACTGGTGCTACTAATGCTACTGCTGGTTACTACTGCTAATGCTTCTGGTACTACTGCTGCTAATGGTGCTACTGGTAACTACTGCTGGTAACTGCTACTGGTGCTTAA',
      length: '658 bp',
      translated: 'MTNPAS TTSSTATGIGTGNGASTANATANGYFGATAAGYYA GASNGATATGNWATAGYYANASGTTAANGATGNYYW',
      translatedNote: 'Translated preview shown as mock support content only.',
    },
    annotationsTab: {
      summary:
        'This biomarker record is marked as validated and complete, with publication-backed provenance and locality coverage notes.',
      items: [
        { label: 'Validation Status', value: 'Validated' },
        { label: 'Marker Type', value: 'COI' },
        { label: 'Accession Number', value: 'ON123456' },
        { label: 'Sequence Completeness', value: 'Complete barcode region' },
        { label: 'Coverage Note', value: 'Included in multi-province species comparison set.' },
        { label: 'Linked Publication', value: 'Santos et al. 2025' },
        { label: 'Evidence / Source Note', value: 'Curated from mock sequence submission and published reference.' },
      ],
    },
    metadataTab: {
      rows: [
        { label: 'Biomarker ID', value: 'BMK0001' },
        { label: 'Species', value: 'Conus eburneus' },
        { label: 'Project', value: 'Barcode Survey' },
        { label: 'Province', value: 'Cebu' },
        { label: 'Municipality', value: 'Oslob' },
        { label: 'Collection Date', value: '2025-02-18' },
        { label: 'Sequencing Platform', value: 'Illumina MiSeq' },
        { label: 'Data Status', value: 'Published' },
        { label: 'Sample Identifier', value: 'CEB-OSL-001' },
      ],
      citation: 'Santos, M.L., Reyes, P.J., and Cruz, A.D. (2025). Philippine cone snail barcodes for regional biodiversity assessment.',
    },
  },
  {
    biomarkerId: 'BMK0002',
    title: 'BMK0002',
    subtitle: 'Biomarker Record',
    status: 'Published',
    topSummaryItems: [
      { label: 'Marker Type', value: '16S rRNA' },
      { label: 'Species', value: 'Conus imperialis' },
      { label: 'Accession Number', value: 'ON123457' },
      { label: 'Sequence Length', value: '512 bp' },
      { label: 'Province', value: 'Cebu' },
      { label: 'Data Status', value: 'Published' },
    ],
    tabs: ['Overview', 'Sequence', 'Annotations', 'Metadata'],
    overview: {
      note: 'Representative 16S ribosomal biomarker entry linked to a curated specimen record.',
      description: 'This mock detail record provides a secondary biomarker example for route continuity and row-level navigation.',
      fields: [
        { label: 'Marker Type', value: '16S rRNA' },
        { label: 'Species', value: 'Conus imperialis' },
        { label: 'Accession Number', value: 'ON123457' },
        { label: 'Sequence Length', value: '512 bp' },
        { label: 'Province', value: 'Cebu' },
        { label: 'Municipality', value: 'Moalboal' },
        { label: 'Project', value: 'ConoPH Core' },
        { label: 'Sequencing Platform', value: 'Sanger' },
      ],
      reference: {
        title: 'Linked Publication',
        citation: 'Garcia, E.V. and Molina, R.S. (2024). Ribosomal markers in Philippine cone snails.',
        actionLabel: 'View in Reference',
      },
    },
    sequenceTab: {
      sequence:
        'ATGCCGTTACCTGAGGAGTTTAACTCCGGTGATGCTAACGATGCTGTTACCACTGCTGCTAACGTTGGTGATGGTGCTACTGATGCTACTGGTGATGCTAACGTTGCTACTGGTGCTGGTGCTTCTGATGGTAACTACTGCTGATGCTTCTAACGGTGCTTAA',
      length: '512 bp',
      translated: 'MP LPEVNSG DANDAVTTAANVGD GATDATG DANDATGAGASDGNYCDASNGA',
      translatedNote: 'Mock translated preview only.',
    },
    annotationsTab: {
      summary: 'Published ribosomal biomarker entry with complete accession coverage.',
      items: [
        { label: 'Validation Status', value: 'Validated' },
        { label: 'Marker Type', value: '16S rRNA' },
        { label: 'Accession Number', value: 'ON123457' },
        { label: 'Sequence Completeness', value: 'Near-complete region' },
        { label: 'Coverage Note', value: 'Included in Cebu locality comparison.' },
        { label: 'Linked Publication', value: 'Garcia and Molina 2024' },
        { label: 'Evidence / Source Note', value: 'Curated from mock museum-linked submission.' },
      ],
    },
    metadataTab: {
      rows: [
        { label: 'Biomarker ID', value: 'BMK0002' },
        { label: 'Species', value: 'Conus imperialis' },
        { label: 'Project', value: 'ConoPH Core' },
        { label: 'Province', value: 'Cebu' },
        { label: 'Municipality', value: 'Moalboal' },
        { label: 'Collection Date', value: '2024-11-06' },
        { label: 'Sequencing Platform', value: 'Sanger' },
        { label: 'Data Status', value: 'Published' },
        { label: 'Sample Identifier', value: 'CIM-MOA-007' },
      ],
      citation: 'Garcia, E.V. and Molina, R.S. (2024). Ribosomal markers in Philippine cone snails.',
    },
  },
]

export const defaultBiomarkerDetailId = biomarkerDetailRecords[0].biomarkerId
