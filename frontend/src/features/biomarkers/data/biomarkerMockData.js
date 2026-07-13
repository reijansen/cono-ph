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
  province: ['All Provinces', 'Cebu', 'Bohol', 'Batangas', 'Palawan', 'Negros Occidental', 'Marinduque'],
  municipality: ['All Municipalities', 'Caw-oy', 'Sogod', 'Panglao', 'N/A'],
  status: ['Published', 'Under Review', 'Unpublished'],
  sequencingPlatform: ['All Platforms', 'Transcriptome-derived', 'PCR-based', 'GenBank', 'In-house database'],
}

export const biomarkerExplorerInitialFilters = {
  search: '',
  project: 'All Projects',
  markerType: 'All Marker Types',
  species: 'All Species',
  province: 'All Provinces',
  municipality: 'All Municipalities',
  sequencingPlatform: 'All Platforms',
  status: [],
  hasAccession: false,
  hasSequenceData: false,
}

export const biomarkerExplorerResultCount = '312 results'

export const biomarkerExplorerRows = [
  {
    biomarkerId: 'BMK0001',
    markerType: 'Unavailable',
    species: 'Conus eburneus',
    accession: 'Unavailable',
    sequenceLength: 'Unavailable',
    province: 'Cebu',
    status: 'Unavailable',
  },
  {
    biomarkerId: 'BMK0002',
    markerType: 'COI',
    species: 'Conus imperialis',
    accession: 'Unavailable',
    sequenceLength: '598 bp',
    province: 'Cebu',
    status: 'Putative',
  },
  {
    biomarkerId: 'BMK0003',
    markerType: 'Unavailable',
    species: 'Conus tessulatus',
    accession: 'Unavailable',
    sequenceLength: 'Unavailable',
    province: 'Cebu',
    status: 'Unavailable',
  },
  {
    biomarkerId: 'BMK0004',
    markerType: 'Unavailable',
    species: 'Conus miles',
    accession: 'Unavailable',
    sequenceLength: 'Unavailable',
    province: 'Marinduque',
    status: 'Putative',
  },
  {
    biomarkerId: 'BMK0005',
    markerType: 'Unavailable',
    species: 'Conus capitaneus',
    accession: 'Unavailable',
    sequenceLength: 'Unavailable',
    province: 'Cebu',
    status: 'Putative',
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
    status: 'Unavailable',
    topSummaryItems: [
      { label: 'Species Name', value: 'Conus eburneus' },
      { label: 'Specimen ID', value: '856252_CE1' },
      { label: 'Gene Marker', value: 'Unavailable' },
      { label: 'Sequence Length (bp)', value: 'Unavailable' },
      { label: 'Collection Province', value: 'Cebu' },
      { label: 'Validation Status', value: 'Unavailable' },
    ],
    tabs: ['Overview', 'Sequence', 'Annotations', 'Metadata'],
    overview: {
      note: 'This example row follows the real CSV field structure and retains unavailable values where the dataset does not expose sequence-level biomarker data.',
      description:
        'The detail model now reflects the actual biomarker columns in the CSV, including locality, publication, similarity source, and conopeptide-linked fields where present.',
      fields: [
        { label: 'Biomarker ID', value: 'BMK0001' },
        { label: 'Species Name', value: 'Conus eburneus' },
        { label: 'Gene Marker', value: 'Unavailable' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Sequence Length (bp)', value: 'Unavailable' },
        { label: 'Collection Province', value: 'Cebu' },
        { label: 'Validation Status', value: 'Unavailable' },
        { label: 'Publication DOI', value: 'https://doi.org/10.3389/fmars.2025.1616692' },
      ],
      reference: {
        title: 'Linked Publication',
        citation: 'https://doi.org/10.3389/fmars.2025.1616692',
        actionLabel: 'View in Reference',
      },
    },
    sequenceTab: {
      sequence: 'Unavailable',
      length: 'Unavailable',
      translated: 'Unavailable',
      translatedNote:
        'The example row does not include a biomarker sequence, so the sequence panel preserves structure while accurately showing missing data.',
      summaryItems: [
        { label: 'Sequence Length (bp)', value: 'Unavailable' },
        { label: 'Source Method', value: 'Unavailable' },
        { label: 'Sequence Completeness', value: 'Unavailable' },
      ],
    },
    annotationsTab: {
      summary:
        'This row is mostly publication- and conopeptide-linked metadata, with unavailable biomarker sequence submission fields.',
      items: [
        { label: 'Validation Status', value: 'Unavailable' },
        { label: 'Gene Marker', value: 'Unavailable' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Coverage Note', value: 'Reference-linked record without exposed biomarker sequence data.' },
        { label: 'Source of Percent Similarity', value: 'BLAST' },
        { label: 'Expression Value', value: 'Unavailable' },
        { label: 'Curated Annotation Remarks', value: 'Contains conopeptide-related columns: precursor length 185, mature conopeptides 54, cysteine pattern C-C-C-C, framework XIV.' },
      ],
      reference: {
        label: 'DOI',
        value: 'https://doi.org/10.3389/fmars.2025.1616692',
        actionLabel: 'View in Reference',
      },
    },
    metadataTab: {
      rows: [
        { label: 'Biomarker ID', value: 'BMK0001' },
        { label: 'Species Name', value: 'Conus eburneus' },
        { label: 'Specimen ID', value: '856252_CE1' },
        { label: 'Collection Province', value: 'Cebu' },
        { label: 'Collection Site (Municipality)', value: 'Caw-oy' },
        { label: 'Source Method', value: 'Unavailable' },
        { label: 'Sequence Database', value: 'Unavailable' },
        { label: 'Validation Status', value: 'Unavailable' },
        { label: 'Sample / Source Identifier', value: '856252_CE1' },
      ],
      citation: 'https://doi.org/10.3389/fmars.2025.1616692',
    },
  },
  {
    biomarkerId: 'BMK0002',
    title: 'BMK0002',
    subtitle: 'Biomarker Record',
    status: 'Putative',
    topSummaryItems: [
      { label: 'Species Name', value: 'Conus imperialis' },
      { label: 'Specimen ID', value: '853932_CI1' },
      { label: 'Gene Marker', value: 'COI' },
      { label: 'Sequence Length (bp)', value: '598' },
      { label: 'Collection Province', value: 'Cebu' },
      { label: 'Validation Status', value: 'Putative' },
    ],
    tabs: ['Overview', 'Sequence', 'Annotations', 'Metadata'],
    overview: {
      note: 'This is the strongest sequence-bearing example in the current biomarker mock set and is used to demonstrate the detail page’s sequence-focused panels.',
      description:
        'The values below use the actual CSV field names and example values from the provided dataset row for Conus imperialis.',
      fields: [
        { label: 'Biomarker ID', value: 'BMK0002' },
        { label: 'Species Name', value: 'Conus imperialis' },
        { label: 'Gene Marker', value: 'COI' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Sequence Length (bp)', value: '598' },
        { label: 'Collection Province', value: 'Cebu' },
        { label: 'Validation Status', value: 'Putative' },
        { label: 'Publication DOI', value: 'Under Review' },
      ],
      reference: {
        title: 'Linked Publication',
        citation: 'Under Review',
        actionLabel: 'View in Reference',
      },
    },
    sequenceTab: {
      sequence:
        'TATTAAAATTCCGATCAGTTAGAAGCATAGTAATAGCTCCAGCCAAGACAGGCAAAGACAGAAGAAGTAAAATAGCTGTGATTTTTACTGACCACACAAAAAGAGAAAGCCGTTCAAATTTTATTCCCTGTCACCGCATATTAATGATTGTAGTAATAAAATTTACCGCTCCTAAAATAGAAGAAACACCTGCAAGGTGTAGAGAAAAAATTGCTAAATCTACAGAACCGCCGGCATGCGCCAAGTTTCCCGCTAAAGGTGGATACACAGTTCATCCTGTTCCTACCCCCCTCTCTACGGCAGCTGAAGATAGAAGAAGCAATAATGCAGGAGGAAGTAACCAGAAACTTATATTATTCAATCGTGGAAATACCATATCCGGGGCCCCTAACATTAAAGGCACCAATCAGTTTCCAAACCCTCCAATCATTATCGGTATAACTAAAAAAAAAATTATTACAAACGCATGTGCTGTTACAATCACGTTGTATAGCTGGTCATCCCCAAGTAAGGCACCAGGTTGCCCTAATTCCGCACGGATTAGAAGCCTTAAAGCGGTCCCAACCAGCCCTGATCATATACCAAATAAAATATACAA',
      length: '598',
      translated: 'Derived translation not shown for this biomarker example.',
      translatedNote:
        'The provided row exposes the nucleotide sequence directly. The translated panel is retained as optional support content only.',
      summaryItems: [
        { label: 'Sequence Length (bp)', value: '598' },
        { label: 'Source Method', value: 'Transcriptome-derived' },
        { label: 'Sequence Completeness', value: 'Sequence available' },
      ],
    },
    annotationsTab: {
      summary:
        'This record aligns closely with the intended biomarker detail structure because it includes gene marker, sequence length, and the actual nucleotide sequence.',
      items: [
        { label: 'Validation Status', value: 'Putative' },
        { label: 'Gene Marker', value: 'COI' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Coverage Note', value: 'Sequence present, publication still listed as under review in the dataset.' },
        { label: 'Source of Percent Similarity', value: 'Unavailable' },
        { label: 'Expression Value', value: 'Unavailable' },
        { label: 'Curated Annotation Remarks', value: 'Transcriptome-derived COI biomarker record from Cebu, Caw-oy locality.' },
      ],
      reference: {
        label: 'DOI',
        value: 'Under Review',
        actionLabel: 'View in Reference',
      },
    },
    metadataTab: {
      rows: [
        { label: 'Biomarker ID', value: 'BMK0002' },
        { label: 'Species Name', value: 'Conus imperialis' },
        { label: 'Specimen ID', value: '853932_CI1' },
        { label: 'Collection Province', value: 'Cebu' },
        { label: 'Collection Site (Municipality)', value: 'Caw-oy' },
        { label: 'Source Method', value: 'Transcriptome-derived' },
        { label: 'Sequence Database', value: 'In-house database' },
        { label: 'Validation Status', value: 'Putative' },
        { label: 'Sample / Source Identifier', value: '853932_CI1' },
      ],
      citation: 'Under Review',
    },
  },
  {
    biomarkerId: 'BMK0003',
    title: 'BMK0003',
    subtitle: 'Biomarker Record',
    status: 'Unavailable',
    topSummaryItems: [
      { label: 'Species Name', value: 'Conus tessulatus' },
      { label: 'Specimen ID', value: '856256_CT1' },
      { label: 'Gene Marker', value: 'Unavailable' },
      { label: 'Sequence Length (bp)', value: 'Unavailable' },
      { label: 'Collection Province', value: 'Cebu' },
      { label: 'Validation Status', value: 'Unavailable' },
    ],
    tabs: ['Overview', 'Sequence', 'Annotations', 'Metadata'],
    overview: {
      note: 'This row demonstrates a publication-linked biomarker record with locality information but no exposed sequence fields.',
      description:
        'The detail content uses the actual CSV headings while keeping unavailable values explicit instead of inventing missing biomarker attributes.',
      fields: [
        { label: 'Biomarker ID', value: 'BMK0003' },
        { label: 'Species Name', value: 'Conus tessulatus' },
        { label: 'Gene Marker', value: 'Unavailable' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Sequence Length (bp)', value: 'Unavailable' },
        { label: 'Collection Province', value: 'Cebu' },
        { label: 'Validation Status', value: 'Unavailable' },
        { label: 'Publication DOI', value: 'https://doi.org/10.3389/fmars.2025.1616692' },
      ],
      reference: {
        title: 'Linked Publication',
        citation: 'https://doi.org/10.3389/fmars.2025.1616692',
        actionLabel: 'View in Reference',
      },
    },
    sequenceTab: {
      sequence: 'Unavailable',
      length: 'Unavailable',
      translated: 'Unavailable',
      translatedNote: 'No sequence was provided in this example row.',
      summaryItems: [
        { label: 'Sequence Length (bp)', value: 'Unavailable' },
        { label: 'Source Method', value: 'Unavailable' },
        { label: 'Sequence Completeness', value: 'Unavailable' },
      ],
    },
    annotationsTab: {
      summary:
        'The available information is mostly publication and locality metadata, so the annotation tab reflects that limited biomarker-specific evidence.',
      items: [
        { label: 'Validation Status', value: 'Unavailable' },
        { label: 'Gene Marker', value: 'Unavailable' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Coverage Note', value: 'Publication-linked row with no exposed biomarker sequence or accession.' },
        { label: 'Source of Percent Similarity', value: 'Unavailable' },
        { label: 'Expression Value', value: 'Unavailable' },
        { label: 'Curated Annotation Remarks', value: 'Cebu locality record retained for biomarker coverage tracking.' },
      ],
      reference: {
        label: 'DOI',
        value: 'https://doi.org/10.3389/fmars.2025.1616692',
        actionLabel: 'View in Reference',
      },
    },
    metadataTab: {
      rows: [
        { label: 'Biomarker ID', value: 'BMK0003' },
        { label: 'Species Name', value: 'Conus tessulatus' },
        { label: 'Specimen ID', value: '856256_CT1' },
        { label: 'Collection Province', value: 'Cebu' },
        { label: 'Collection Site (Municipality)', value: 'Caw-oy' },
        { label: 'Source Method', value: 'Unavailable' },
        { label: 'Sequence Database', value: 'Unavailable' },
        { label: 'Validation Status', value: 'Unavailable' },
        { label: 'Sample / Source Identifier', value: '856256_CT1' },
      ],
      citation: 'https://doi.org/10.3389/fmars.2025.1616692',
    },
  },
  {
    biomarkerId: 'BMK0004',
    title: 'BMK0004',
    subtitle: 'Biomarker Record',
    status: 'Putative',
    topSummaryItems: [
      { label: 'Species Name', value: 'Conus miles' },
      { label: 'Specimen ID', value: '852343_CM1' },
      { label: 'Gene Marker', value: 'Unavailable' },
      { label: 'Sequence Length (bp)', value: 'Unavailable' },
      { label: 'Collection Province', value: 'Marinduque' },
      { label: 'Validation Status', value: 'Putative' },
    ],
    tabs: ['Overview', 'Sequence', 'Annotations', 'Metadata'],
    overview: {
      note: 'This row is useful for showing how the detail page behaves when a record contains source-method metadata but not a biomarker sequence submission.',
      description:
        'The field labels now mirror the actual dataset while preserving unavailable values from the source row.',
      fields: [
        { label: 'Biomarker ID', value: 'BMK0004' },
        { label: 'Species Name', value: 'Conus miles' },
        { label: 'Gene Marker', value: 'Unavailable' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Sequence Length (bp)', value: 'Unavailable' },
        { label: 'Collection Province', value: 'Marinduque' },
        { label: 'Validation Status', value: 'Putative' },
        { label: 'Publication DOI', value: 'https://doi.org/10.3390/md23070266' },
      ],
      reference: {
        title: 'Linked Publication',
        citation: 'https://doi.org/10.3390/md23070266',
        actionLabel: 'View in Reference',
      },
    },
    sequenceTab: {
      sequence: 'Unavailable',
      length: 'Unavailable',
      translated: 'Unavailable',
      translatedNote:
        'This example retains the sequence panel for consistency, but the actual row does not provide a nucleotide sequence.',
      summaryItems: [
        { label: 'Sequence Length (bp)', value: 'Unavailable' },
        { label: 'Source Method', value: 'Transcriptome-derived' },
        { label: 'Sequence Completeness', value: 'Unavailable' },
      ],
    },
    annotationsTab: {
      summary:
        'The annotation content is limited to the real fields present in the row: publication linkage, source method context, and putative validation state.',
      items: [
        { label: 'Validation Status', value: 'Putative' },
        { label: 'Gene Marker', value: 'Unavailable' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Coverage Note', value: 'Transcriptome-derived record without exposed sequence or accession fields.' },
        { label: 'Source of Percent Similarity', value: 'Unavailable' },
        { label: 'Expression Value', value: 'Unavailable' },
        { label: 'Curated Annotation Remarks', value: 'Marinduque locality sample with reference-only biomarker metadata.' },
      ],
      reference: {
        label: 'DOI',
        value: 'https://doi.org/10.3390/md23070266',
        actionLabel: 'View in Reference',
      },
    },
    metadataTab: {
      rows: [
        { label: 'Biomarker ID', value: 'BMK0004' },
        { label: 'Species Name', value: 'Conus miles' },
        { label: 'Specimen ID', value: '852343_CM1' },
        { label: 'Collection Province', value: 'Marinduque' },
        { label: 'Collection Site (Municipality)', value: 'N/A' },
        { label: 'Source Method', value: 'Transcriptome-derived' },
        { label: 'Sequence Database', value: 'Unavailable' },
        { label: 'Validation Status', value: 'Putative' },
        { label: 'Sample / Source Identifier', value: '852343_CM1' },
      ],
      citation: 'https://doi.org/10.3390/md23070266',
    },
  },
  {
    biomarkerId: 'BMK0005',
    title: 'BMK0005',
    subtitle: 'Biomarker Record',
    status: 'Putative',
    topSummaryItems: [
      { label: 'Species Name', value: 'Conus capitaneus' },
      { label: 'Specimen ID', value: '852340_CC1' },
      { label: 'Gene Marker', value: 'Unavailable' },
      { label: 'Sequence Length (bp)', value: 'Unavailable' },
      { label: 'Collection Province', value: 'Cebu' },
      { label: 'Validation Status', value: 'Putative' },
    ],
    tabs: ['Overview', 'Sequence', 'Annotations', 'Metadata'],
    overview: {
      note: 'This row reflects a transcriptome-derived locality record with publication metadata but no public biomarker sequence fields.',
      description:
        'The page now uses actual CSV labels like Collection Site (Municipality), External Accession, and Source Method instead of generic placeholders.',
      fields: [
        { label: 'Biomarker ID', value: 'BMK0005' },
        { label: 'Species Name', value: 'Conus capitaneus' },
        { label: 'Gene Marker', value: 'Unavailable' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Sequence Length (bp)', value: 'Unavailable' },
        { label: 'Collection Province', value: 'Cebu' },
        { label: 'Validation Status', value: 'Putative' },
        { label: 'Publication DOI', value: 'https://doi.org/10.3390/md23070266' },
      ],
      reference: {
        title: 'Linked Publication',
        citation: 'https://doi.org/10.3390/md23070266',
        actionLabel: 'View in Reference',
      },
    },
    sequenceTab: {
      sequence: 'Unavailable',
      length: 'Unavailable',
      translated: 'Unavailable',
      translatedNote: 'No biomarker sequence string is provided in the source row.',
      summaryItems: [
        { label: 'Sequence Length (bp)', value: 'Unavailable' },
        { label: 'Source Method', value: 'Transcriptome-derived' },
        { label: 'Sequence Completeness', value: 'Unavailable' },
      ],
    },
    annotationsTab: {
      summary:
        'This mock record demonstrates a putative biomarker entry with reference and locality fields present but sequence-level evidence unavailable.',
      items: [
        { label: 'Validation Status', value: 'Putative' },
        { label: 'Gene Marker', value: 'Unavailable' },
        { label: 'External Accession', value: 'Unavailable' },
        { label: 'Coverage Note', value: 'Cebu, Caw-oy locality row retained despite unavailable sequence submission.' },
        { label: 'Source of Percent Similarity', value: 'Unavailable' },
        { label: 'Expression Value', value: 'Unavailable' },
        { label: 'Curated Annotation Remarks', value: 'Transcriptome-derived metadata-only biomarker row.' },
      ],
      reference: {
        label: 'DOI',
        value: 'https://doi.org/10.3390/md23070266',
        actionLabel: 'View in Reference',
      },
    },
    metadataTab: {
      rows: [
        { label: 'Biomarker ID', value: 'BMK0005' },
        { label: 'Species Name', value: 'Conus capitaneus' },
        { label: 'Specimen ID', value: '852340_CC1' },
        { label: 'Collection Province', value: 'Cebu' },
        { label: 'Collection Site (Municipality)', value: 'Caw-oy' },
        { label: 'Source Method', value: 'Transcriptome-derived' },
        { label: 'Sequence Database', value: 'Unavailable' },
        { label: 'Validation Status', value: 'Putative' },
        { label: 'Sample / Source Identifier', value: '852340_CC1' },
      ],
      citation: 'https://doi.org/10.3390/md23070266',
    },
  },
]

export const defaultBiomarkerDetailId = biomarkerDetailRecords[0].biomarkerId
