const CONOPEPTIDE_DETAIL_BACKUP_PATH = '/backup-data/json/conopeptides/latest.json'

function normalizeRecord(record) {
  return {
    accession: String(record['Conopeptide ID'] ?? record.accession ?? ''),
    title: String(record['Conopeptide ID'] ?? record.accession ?? ''),
    subtitle: 'Conopeptide Precursor',
    status: String(record['DOI'] ?? 'Unavailable') === 'Unpublished' ? 'Unpublished' : 'Published',
    topSummaryItems: [
      { label: 'Conopeptide ID', value: String(record['Conopeptide ID'] ?? 'Unavailable') },
      { label: 'Species', value: String(record['Scientific name'] ?? 'Unavailable') },
      { label: 'Species ID', value: String(record['Species ID'] ?? 'Unavailable') },
      { label: 'Gene superfamily', value: String(record['Gene superfamily'] ?? 'Unavailable') },
      { label: 'Precursor length', value: `${String(record['Length of Precursor Sequence'] ?? 'Unavailable')} aa` },
      { label: 'Cysteine Framework', value: String(record['Cysteine Framework'] ?? 'Unavailable') },
    ],
    generalInformation: {
      conopeptideId: String(record['Conopeptide ID'] ?? 'Unavailable'),
      species: String(record['Scientific name'] ?? 'Unavailable'),
      speciesId: String(record['Species ID'] ?? 'Unavailable'),
      sequenceRemarks: String(record['Remarks for Sequence'] ?? 'Unavailable'),
    },
    sequenceInformation: {
      precursorSequence: String(record['Precursor Sequence'] ?? 'Unavailable'),
      precursorLength: `${String(record['Length of Precursor Sequence'] ?? 'Unavailable')} aa`,
    },
    sequenceArchitecture: [
      { label: 'Signal peptide', value: String(record['Signal peptide'] ?? 'Unavailable') },
      { label: 'Propeptide', value: String(record['Propeptide sequence'] ?? 'Unavailable') },
      { label: 'Mature peptide', value: String(record['Mature Peptide Sequence'] ?? 'Unavailable') },
      { label: 'Post peptide', value: String(record['Post Peptide Sequence'] ?? 'Unavailable') },
    ],
    classification: {
      geneSuperfamily: String(record['Gene superfamily'] ?? 'Unavailable'),
      maturePeptideLength: `${String(record['Length of Mature Conopeptides'] ?? 'Unavailable')} aa`,
      numberOfCysteines: String(record['Number of Cysteine Residues'] ?? 'Unavailable'),
      cysteinePattern: String(record['Cysteine Pattern'] ?? 'Unavailable'),
      cysteineFramework: String(record['Cysteine Framework'] ?? 'Unavailable'),
    },
    similarity: {
      matchedToxin: String(record['Matched Toxin'] ?? 'Unavailable'),
      percentSimilarity: String(record['Percent Similarity'] ?? 'Unavailable'),
      similaritySource: String(record['Source of Percent Similarity'] ?? 'Unavailable'),
    },
    expression: {
      expressionValue: String(record['Expression Value'] ?? 'Unavailable'),
    },
    reference: {
      doi: String(record['DOI'] ?? 'Unavailable'),
    },
  }
}

export async function loadConopeptideBackupDetails() {
  const response = await fetch(CONOPEPTIDE_DETAIL_BACKUP_PATH, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Backup conopeptide data not found (${response.status})`)
  const records = await response.json()
  if (!Array.isArray(records)) throw new Error('Backup conopeptide data is not an array')
  return records.map(normalizeRecord).filter((record) => record.accession)
}
