# Backend API Contract Guide

## Scope

This document is for frontend/backend coordination. The frontend owns the React MVC-style structure, while the backend owns its internal architecture.

The frontend does not require the backend to implement MVC specifically. It only requires stable endpoints, consistent response shapes, predictable field names, pagination metadata, and useful error responses.

## Frontend Architecture Assumption

The frontend now follows a React-friendly MVC split:

```text
Model      feature data modules, API services, response contracts
View       page and component JSX
Controller feature controller hooks that own filters, routing actions, and view state
```

Example frontend flow:

```text
Page View -> Controller Hook -> Service/API Client -> Backend Endpoint
```

Backend responses should be designed so controllers can transform data once and views can stay mostly presentational.

## Required Response Format

All API responses should follow this shape.

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error:

```json
{
  "success": false,
  "data": null,
  "message": "User-friendly error message",
  "error": "error_code_for_debugging"
}
```

For non-list endpoints, `pagination` can be omitted.

## Field Naming

Use `snake_case` in API responses for now because the current database and frontend mock data already use it in several API-facing places.

Rules:

- Use one canonical ID field per resource.
- Species should use `id`, not mixed `id` and `species_id`.
- Keep timestamps as ISO-8601 strings.
- Do not return placeholder product fields such as `name`, `price`, or `image` for species.

## Endpoints Needed By Frontend

### Species

`GET /api/species`

Query params:

```text
page
limit
search
sortBy
order
project
subgenus
province
municipality
status
diet
sequencingPlatform
rawDataInNcbiSra
```

Expected item shape:

```json
{
  "id": "SPC-001",
  "scientific_name": "Conus eburneus",
  "common_name": "Ivory Cone",
  "subgenus": "Tesseliconus",
  "province": "Cebu",
  "municipality": "Oslob",
  "precursors_count": 149,
  "status": "Published",
  "project": "ConoPH Core",
  "diet": "Molluscivore",
  "sequencing_platform": "Illumina HiSeq",
  "raw_data_in_ncbi_sra": true,
  "shell_image": "https://example.com/image.png"
}
```

`GET /api/species/:id`

Returns one species detail record with related conopeptides, biomarkers, publications, taxonomy, and locality fields when available.

### Conopeptides

`GET /api/conopeptides`

Query params:

```text
page
limit
search
project
superfamily
province
municipality
cysteineFramework
status
hasPredictedPeptide
```

Expected item shape:

```json
{
  "accession": "ConoPH0001",
  "species_id": "SPC-001",
  "species": "Conus magus",
  "superfamily": "M",
  "framework": "MII",
  "predicted_peptide": "GCCSHPACG...",
  "matched_toxin": "Conotoxin KIIIA",
  "province": "Cebu",
  "status": "Published"
}
```

`GET /api/conopeptides/:accession`

Returns one conopeptide detail record including precursor, signal, propeptide, mature peptide, post peptide, annotations, references, and species linkage.

### Biomarkers

`GET /api/biomarkers`

Query params:

```text
page
limit
search
project
markerType
species
province
municipality
sequencingPlatform
status
hasAccession
hasSequenceData
```

Expected item shape:

```json
{
  "biomarker_id": "BMK0002",
  "marker_type": "COI",
  "species": "Conus imperialis",
  "accession": "ABC123456",
  "sequence_length": "598 bp",
  "province": "Cebu",
  "status": "Putative"
}
```

`GET /api/biomarkers/:id`

Returns one biomarker detail record grouped into:

- General information
- Annotation information
- Sequence
- References

The sequence field must be copyable on the frontend, so return the raw sequence string separately from formatted display text.

### Visualization

The visualization pages need aggregate endpoints eventually:

```text
GET /api/visualization/summary
GET /api/visualization/species
GET /api/visualization/conopeptides
GET /api/visualization/biomarkers
```

Each endpoint should return metric arrays, chart series, legends, and ranked rows in stable structures.

## Error Handling Requirements

Frontend controllers expect errors to be machine-readable and user-readable.

Use:

```json
{
  "success": false,
  "data": null,
  "message": "Species not found",
  "error": "species_not_found"
}
```

Avoid:

```json
{
  "error": "raw database exception"
}
```

## Pagination Requirements

Every list endpoint should support pagination and return:

```json
{
  "page": 1,
  "limit": 10,
  "total": 312,
  "totalPages": 32
}
```

The frontend pagination components rely on `page` and `totalPages`.

## Current Backend Issues To Resolve

These are backend-side contract issues visible from the frontend:

- `GET /api/species/:id` should query `id`, not `species_id`, unless the schema changes.
- `PUT /api/species/:id` should accept real species fields, not `name`, `price`, and `image`.
- Species creation currently expects `num_related_publications`, but the actual species schema does not define that column.
- Database initialization should eventually move out of `server.js`, but this is not a frontend blocker.

## Coordination Rule

The backend can use MVC, service/repository layers, or another internal structure. The frontend only depends on the public API contract in this document.
