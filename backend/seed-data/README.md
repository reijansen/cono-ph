# JSON Backup Data

Store crash-recovery CSV inputs here and generate JSON backups from them.

Recommended structure:

- `csv/species/`
- `csv/conopeptides/`
- `csv/barcodes/`
- `csv/publications/`
- `csv/taxonomic/`
- `json/species/`
- `json/conopeptides/`
- `json/barcodes/`
- `json/publications/`
- `json/taxonomic/`

Put each CSV file in the matching `csv/<dataset>/` folder and name it with the snapshot date or batch label, for example:

- `csv/species/species_2026-07-15.csv`
- `csv/conopeptides/conopeptides_2026-07-15.csv`
- `csv/barcodes/barcodes_2026-07-15.csv`
- `csv/publications/publications_2026-07-15.csv`
- `csv/taxonomic/taxonomic_2026-07-15.csv`

Run this from the repository root:

```bash
npm run seed:json
```

The script writes backend-private JSON to the matching `json/<dataset>/` folder with the same base file name. It does not write anything to `frontend/public`.
