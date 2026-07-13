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
    accession: '856252_CE1_1',
    title: '856252_CE1_1',
    subtitle: 'Conopeptide Precursor',
    status: 'Published',
    topSummaryItems: [
      { label: 'Conopeptide ID', value: '856252_CE1_1' },
      { label: 'Species', value: 'Conus eburneus' },
      { label: 'Species ID', value: '856252_CE1' },
      { label: 'Gene superfamily', value: 'AMP44597.1' },
      { label: 'Length of Precursor Sequence', value: '185' },
      { label: 'Cysteine Framework', value: 'XIV' },
    ],
    predictedPeptide: 'MCRREWSSVVWCSDLSPSSQLYIPASLCDHLNLINMLRLIIAAVLASACLAYPQ',
    predictedPeptideMarkers: ['1', '5', '10', '15'],
    predictedPeptideLegend: 'Mature peptide',
    about: 'Partial precursor record with unavailable signal and propeptide annotations.',
    matchedToxin: {
      name: 'Unavailable',
      tag: 'Unavailable',
      summary: 'No matched toxin recorded for this example row.',
      reference: 'Unavailable',
      referenceAction: 'View in Reference',
    },
    precursorSequence: [
      'MCRREWSSVVWCSDLSPSSQLYIPASLCDHLNLINMLRLIIAAVLASACLAYPQKRDGAPADSANLQPFDAGMQAMPAMPNMQGMQGMPMPGIASQFLPFNPNLGLGYRRDVDENLEKRKHHSKFNEDNKSPFSAEDGLGNFMNFMKENGNLPFAQMDNGAADLGNFEPSAEKEDGKFRFFDEQQ',
    ],
    precursorMetadata: {
      length: '185',
      translation: '54 amino acids (aa)',
    },
    translatedPrecursorSegments: [
      { text: 'M C R R E W S S V V W C S D L S P S S Q L Y I P A S L C D H L N L I N M L R L I I A A V L A S A C L A Y P Q', highlighted: true },
      { text: ' *', highlighted: false },
    ],
    additionalInformation: [
      { label: 'Conopeptide ID', value: '856252_CE1_1' },
      { label: 'Species', value: 'Conus eburneus' },
      { label: 'Species ID', value: '856252_CE1' },
      { label: 'Validation status', value: 'Known' },
      { label: 'DOI', value: 'https://doi.org/10.3389/fmars.2025.1616692' },
      { label: 'Source of Percent Similarity', value: 'BLAST' },
    ],
    sequencesTab: {
      fields: [
        { label: 'Conopeptide ID', value: '856252_CE1_1' },
        { label: 'Species', value: 'Conus eburneus' },
        { label: 'Species ID', value: '856252_CE1' },
        {
          label: 'Precursor Sequence',
          value:
            'MCRREWSSVVWCSDLSPSSQLYIPASLCDHLNLINMLRLIIAAVLASACLAYPQKRDGAPADSANLQPFDAGMQAMPAMPNMQGMQGMPMPGIASQFLPFNPNLGLGYRRDVDENLEKRKHHSKFNEDNKSPFSAEDGLGNFMNFMKENGNLPFAQMDNGAADLGNFEPSAEKEDGKFRFFDEQQ',
        },
        {
          label: 'Remarks for Sequence',
          value: 'Partial',
        },
        {
          label: 'Signal peptide',
          value: 'Unavailable',
        },
        {
          label: 'Propeptide sequence',
          value: 'Unavailable',
        },
        {
          label: 'Mature Peptide Sequence',
          value: 'MCRREWSSVVWCSDLSPSSQLYIPASLCDHLNLINMLRLIIAAVLASACLAYPQ',
        },
        { label: 'Post Peptide Sequence', value: 'None' },
        { label: 'Gene superfamily', value: 'AMP44597.1' },
        { label: 'Cysteine Framework', value: 'XIV' },
      ],
      predictedPeptide: 'MCRREWSSVVWCSDLSPSSQLYIPASLCDHLNLINMLRLIIAAVLASACLAYPQ',
      predictedPeptideMarkers: ['1', '5', '10', '15'],
      predictedPeptideNote: 'Predicted mature peptide region from the example record.',
      precursorSequence: [
        'MCRREWSSVVWCSDLSPSSQLYIPASLCDHLNLINMLRLIIAAVLASACLAYPQKRDGAPADSANLQPFDAGMQAMPAMPNMQGMQGMPMPGIASQFLPFNPNLGLGYRRDVDENLEKRKHHSKFNEDNKSPFSAEDGLGNFMNFMKENGNLPFAQMDNGAADLGNFEPSAEKEDGKFRFFDEQQ',
      ],
      precursorSequenceNote: 'Partial precursor sequence with unavailable signal and propeptide regions.',
      translatedPrecursorSegments: [
        { text: 'M C R R E W S S V V W C S D L S P S S Q L Y I P A S L C D H L N L I N M L R L I I A A V L A S A C L A Y P Q', highlighted: true },
        { text: ' *', highlighted: false },
      ],
      translatedPrecursorNote: 'Example mature peptide highlighted within the precursor translation.',
    },
    annotationsTab: {
      summary:
        'Validation status and similarity source are shown for the example record.',
      items: [
        { label: 'Validation status', value: 'Known' },
        { label: 'Matched toxin', value: 'Unavailable' },
        { label: 'Percent Similarity', value: '83.553' },
        { label: 'Source of Percent Similarity', value: 'BLAST' },
        { label: 'Expression Value', value: 'Unavailable' },
        { label: 'DOI', value: 'https://doi.org/10.3389/fmars.2025.1616692' },
      ],
    },
    sourceTab: {
      citation: 'https://doi.org/10.3389/fmars.2025.1616692',
      rows: [
        { label: 'Length of Precursor Sequence', value: '185' },
        { label: 'Length of Mature Conopeptides', value: '54' },
        { label: 'Number of Cysteine Residues', value: '4' },
        { label: 'Cysteine Pattern', value: 'C-C-C-C' },
        { label: 'Cysteine Framework', value: 'XIV' },
      ],
    },
    tabs: ['Overview', 'Sequences', 'Annotations', 'Source'],
  },
]

export const defaultConopeptideDetailId = conopeptideDetailRecords[0].accession
