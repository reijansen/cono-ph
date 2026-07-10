import { Database, Layers3, FileCheck2, Sparkles } from 'lucide-react'

export const conopeptideExplorerBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Conopeptides' },
]

export const conopeptideExplorerMeta = {
  title: 'Conopeptides Explorer',
  subtitle: 'Explore conopeptide precursors and predicted mature peptides from Philippine cone snails.',
}

export const conopeptideExplorerMetrics = [
  {
    icon: Database,
    value: '3,671',
    label: 'Total Precursors',
    description: 'Across the current curated transcriptomic records.',
  },
  {
    icon: Layers3,
    value: '67',
    label: 'Superfamilies',
    description: 'Grouped by gene family and sequence pattern.',
  },
  {
    icon: Sparkles,
    value: '1,248',
    label: 'Unique Peptides',
    description: 'Distinct predicted mature peptide sequences.',
  },
  {
    icon: FileCheck2,
    value: '56',
    label: 'Species with Data',
    description: 'Species records linked to conopeptide evidence.',
  },
]

export const conopeptideFilterOptions = {
  project: ['All Projects', 'ConoPH Core', 'Visayas Survey', 'Mindanao Survey'],
  superfamily: ['All Superfamilies', 'A', 'M', 'O1', 'O2', 'T', 'I', 'S', 'Unknown'],
  province: ['All Provinces', 'Cebu', 'Bohol', 'Palawan', 'Samar'],
  municipality: ['All Municipalities', 'Oslob', 'Moalboal', 'Danao', 'Bantayan'],
  cysteineFramework: ['All Cysteine Frameworks', 'Framework I', 'Framework II', 'Framework III', 'Framework VI/VII'],
  status: ['Published', 'Under Review', 'Unpublished'],
}

export const conopeptideExplorerRows = [
  {
    accession: 'ConoPH0001',
    superfamily: 'M',
    framework: 'MII',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin KIIIA',
    species: 'Conus magus',
    province: 'Cebu',
  },
  {
    accession: 'ConoPH0002',
    superfamily: 'O1',
    framework: 'O1',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin G',
    species: 'Conus eburneus',
    province: 'Cebu',
  },
  {
    accession: 'ConoPH0003',
    superfamily: 'T',
    framework: 'T',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conomarphin',
    species: 'Conus tessulatus',
    province: 'Palawan',
  },
  {
    accession: 'ConoPH0004',
    superfamily: 'A',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Contulakin-G',
    species: 'Conus mustelinus',
    province: 'Bohol',
  },
  {
    accession: 'ConoPH0005',
    superfamily: 'M',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin PnIA',
    species: 'Conus imperialis',
    province: 'Cebu',
  },
  {
    accession: 'ConoPH0006',
    superfamily: 'S',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin SxVIIA',
    species: 'Conus striatus',
    province: 'Samar',
  },
  {
    accession: 'ConoPH0007',
    superfamily: 'O2',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin RgIA',
    species: 'Conus rolani',
    province: 'Palawan',
  },
  {
    accession: 'ConoPH0008',
    superfamily: 'I',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin ImI',
    species: 'Conus miles',
    province: 'Bohol',
  },
  {
    accession: 'ConoPH0009',
    superfamily: 'M',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin AuIB',
    species: 'Conus capitaneus',
    province: 'Cebu',
  },
  {
    accession: 'ConoPH0010',
    superfamily: 'A',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin MrIA',
    species: 'Conus litteratus',
    province: 'Palawan',
  },
]

export const conopeptidePagination = {
  page: 1,
  totalPages: 68,
}

export const conopeptideDetailRecords = [
  {
    accession: 'ConoPH0001',
    title: 'ConoPH0001',
    subtitle: 'Conopeptide Precursor',
    status: 'Published',
    topSummaryItems: [
      { label: 'Gene Superfamily', value: 'M Superfamily' },
      { label: 'Cysteine Framework', value: 'MII' },
      { label: 'Predicted Peptide', value: 'GCCSHPACGKGRR...' },
      { label: 'Matched Toxin', value: 'µ-Conotoxin KIIIA' },
      { label: 'Species', value: 'Conus textile' },
      { label: 'Province', value: 'Cebu' },
    ],
    predictedPeptide: 'GCCSHPACGKGRRC',
    predictedPeptideMarkers: ['1', '5', '10', '15'],
    predictedPeptideLegend: 'Cysteine',
    about:
      'Predicted mature conopeptide cleaved from the precursor sequence and curated from transcriptomic evidence.',
    matchedToxin: {
      name: 'Conotoxin KIIIA',
      tag: 'Neurotoxin',
      summary:
        'Potent inhibitor of voltage-gated sodium channels (Nav). Associated with analgesic effects.',
      reference: 'Lewis, R.J., Garcia, M.L. (2003) Toxicon, 42(2), 135-149',
      referenceAction: 'View in Reference',
    },
    precursorSequence: [
      'ATG GCT TGT TGT TCT CAT CCG GCT TGT GGT AAG GGC GCC GCC TGC TGT GAA GAC',
      'GCT TGT GAA GGA AAG GAG CGC TGT TAA',
    ],
    precursorMetadata: {
      length: '60 nucleotides (nt)',
      translation: '20 amino acids (aa)',
    },
    translatedPrecursorSegments: [
      { text: 'M A C C ', highlighted: false },
      { text: 'S H P A C G K G R R C E D A E G K E R C', highlighted: true },
      { text: ' *', highlighted: false },
    ],
    additionalInformation: [
      { label: 'Accession', value: 'ConoPH0001' },
      { label: 'Transcript ID', value: 'TRINITY_DN100_c0_g1_i1' },
      { label: 'Data Status', value: 'Published' },
      { label: 'Project', value: 'Project 1 - Anti-Pain and Anti-Neurodegeneration Drug Candidates' },
      { label: 'Specimen ID', value: 'UPD-MSI-CTEX-001' },
      { label: 'Collection Date', value: '2022-07-15' },
      { label: 'Sequencing Platform', value: 'Illumina NovaSeq 6000' },
    ],
    sequencesTab: {
      predictedPeptide: 'GCCSHPACGKGRRC',
      predictedPeptideMarkers: ['1', '5', '10', '15'],
      predictedPeptideNote: 'Predicted mature peptide region with conserved cysteine positions.',
      precursorSequence: [
        'ATG GCT TGT TGT TCT CAT CCG GCT TGT GGT AAG GGC GCC GCC TGC TGT GAA GAC',
        'GCT TGT GAA GGA AAG GAG CGC TGT TAA',
      ],
      precursorSequenceNote: 'Transcript-derived nucleotide sequence aligned to the precursor record.',
      translatedPrecursorSegments: [
        { text: 'M A C C ', highlighted: false },
        { text: 'S H P A C G K G R R C E D A E G K E R C', highlighted: true },
        { text: ' *', highlighted: false },
      ],
      translatedPrecursorNote: 'Mature peptide highlighted within the translated precursor.',
    },
    annotationsTab: {
      summary:
        'Curated as a member of the M superfamily with a cysteine-rich mature peptide motif.',
      items: [
        { label: 'Superfamily Assignment', value: 'M Superfamily' },
        { label: 'Cysteine Framework', value: 'MII' },
        { label: 'Matched Toxin / Family', value: 'µ-Conotoxin KIIIA' },
        { label: 'Evidence Level', value: 'Transcriptomic / curated' },
        { label: 'Functional Summary', value: 'Likely neuroactive peptide associated with ion channel inhibition.' },
      ],
    },
    sourceTab: {
      citation: 'Lewis, R.J., Garcia, M.L. (2003) Toxicon, 42(2), 135-149',
      rows: [
        { label: 'Accession', value: 'ConoPH0001' },
        { label: 'Transcript ID', value: 'TRINITY_DN100_c0_g1_i1' },
        { label: 'Project', value: 'Project 1 - Anti-Pain and Anti-Neurodegeneration Drug Candidates' },
        { label: 'Specimen ID', value: 'UPD-MSI-CTEX-001' },
        { label: 'Collection Date', value: '2022-07-15' },
        { label: 'Province', value: 'Cebu' },
        { label: 'Sequencing Platform', value: 'Illumina NovaSeq 6000' },
        { label: 'Data Status', value: 'Published' },
      ],
    },
    tabs: ['Overview', 'Sequences', 'Annotations', 'Source'],
  },
]

export const defaultConopeptideDetailId = conopeptideDetailRecords[0].accession
