import speciesShellImage from '@/assets/HomeShell.png'

export const speciesDetailRecords = [
  {
    speciesId: 'conus-eburneus',
    species: {
      scientificName: 'Conus eburneus',
      commonName: 'Ivory Cone',
      subgenus: 'Tesseliconus',
      image: speciesShellImage,
      imageAlt: 'Conus eburneus shell',
    },
    conopeptides: [
      {
        conopeptideId: 'ConoPH000001',
        geneSuperfamily: 'M',
        framework: 'Framework III',
        specimenId: 'MSI-CEB-001',
        publication: 'Lewis et al. (2003)',
      },
      {
        conopeptideId: 'ConoPH000002',
        geneSuperfamily: 'O1',
        framework: 'Framework VI/VII',
        specimenId: 'MSI-CEB-001',
        publication: 'Identification of Conomarphin Variants...',
      },
      {
        conopeptideId: 'ConoPH000003',
        geneSuperfamily: 'T',
        framework: 'Framework XII',
        specimenId: 'MSI-CEB-001',
        publication: 'Conus eburneus transcriptome study',
      },
      {
        conopeptideId: 'ConoPH000004',
        geneSuperfamily: 'A',
        framework: 'Framework III',
        specimenId: 'MSI-CEB-001',
        publication: 'Lewis et al. (2003)',
      },
    ],
    specimens: [
      {
        specimenId: 'MSI-CEB-001',
        author: 'J. D. Santiago',
        repository: 'The Marine Science Institute (MSI)',
        province: 'Cebu',
        tissueSource: 'Venom gland',
        sequencingPlatform: 'Novaseq 6000',
        totalConopeptideSequences: '149',
        status: 'Published',
        collectionDate: '2024-05-12',
      },
      {
        specimenId: 'MSI-CEB-002',
        author: 'M. R. Alvarez',
        repository: 'The Marine Science Institute (MSI)',
        province: 'Cebu',
        tissueSource: 'Venom gland tissues',
        sequencingPlatform: 'Oxford Nanopore',
        totalConopeptideSequences: '151',
        status: 'Under Review',
        collectionDate: '2024-06-03',
      },
      {
        specimenId: 'MSI-CEB-003',
        author: 'A. P. Reyes',
        repository: 'University Repository',
        province: 'Bohol',
        tissueSource: 'Venom gland',
        sequencingPlatform: 'PacBio',
        totalConopeptideSequences: '138',
        status: 'Published',
        collectionDate: '2024-06-22',
      },
      {
        specimenId: 'MSI-CEB-004',
        author: 'L. C. Ramos',
        repository: 'The Marine Science Institute (MSI)',
        province: 'Palawan',
        tissueSource: 'Venom gland tissues',
        sequencingPlatform: 'Illumina HiSeq',
        totalConopeptideSequences: '144',
        status: 'Published',
        collectionDate: '2024-07-09',
      },
    ],
    publications: [
      {
        title:
          'Identification of Conomarphin Variants in the Conus eburneus Venom and the Effect of Sequence and PTM Variations on Conomarphin Conformation',
        authors: 'Itang et al.',
        journal: 'Marine Drugs',
        year: '2020',
        doi: '10.3390/md18100503',
        project: 'DDHP Project 1',
        linkedConopeptidesCount: '37',
      },
      {
        title:
          'Transcriptomic Insights into Conus eburneus: Conopeptide Discovery and Functional Annotation',
        authors: 'Santiago et al.',
        journal: 'Frontiers in Marine Science',
        year: '2021',
        doi: '10.3389/fmars.2021.01234',
        project: 'ConoPH Core',
        linkedConopeptidesCount: '29',
      },
      {
        title:
          'Molecular Characterization of Philippine Cone Snail Venom Transcripts from Conus eburneus',
        authors: 'Alvarez et al.',
        journal: 'Journal of Proteomics',
        year: '2022',
        doi: '10.1016/j.jprot.2022.104567',
        project: 'Visayas Survey',
        linkedConopeptidesCount: '41',
      },
    ],
    statistics: [
      { label: 'Conopeptide Precursors', value: '149' },
      { label: 'Total Gene Superfamilies', value: '1' },
      { label: 'Specimens Sequenced', value: '1' },
      { label: 'Sequencing Platform', value: 'Novaseq 6000' },
      { label: 'Raw Data in NCBI SRA', value: 'N/A' },
    ],
    taxonomy: {
      scientificName: 'Conus eburneus',
      commonName: 'Ivory Cone',
      organismsDiet: 'Vermivorous',
      subgenus: 'Tesseliconus',
      anatomicalSample: 'Venom gland',
      tissueSource: 'Venom gland tissues',
    },
    collection: {
      province: 'Cebu',
      municipality: 'Moalboal',
      psgc: '072234000',
      specimenRepository: 'The Marine Science Institute (MSI)',
    },
    molecular: {
      specimensSequenced: '1',
      totalConopeptides: '149',
      totalGeneSuperfamilies: '1',
      sequencingPlatform: 'Novaseq 6000',
      coiMarker: 'N/A',
      rawDataAvailable: 'No',
      sraAccession: 'N/A',
    },
    publication: {
      doi: 'https://doi.org/10.3390/md18100503',
      title:
        'Identification of Conomarphin Variants in the Conus eburneus Venom and the Effect of Sequence and PTM Variations on Conomarphin Conformation',
      authors:
        'Corazon Ericka Mae M. Itang, Jokent T. Gaza, Dan Jethro M. Masacupan, Dessa Camille R. Batocoy, Yu-Ju Chen, Ricky B. Nellas, and Elzadora T. Yu',
      project: 'DDHP Project 1',
    },
  },
]

export const defaultSpeciesDetailId = speciesDetailRecords[0].speciesId
