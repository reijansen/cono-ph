# ConoPH

ConoPH is a full-stack proof-of-concept biodiversity database and exploration platform for Philippine cone snails, conopeptide precursor sequences, biomarkers, taxonomy, collection metadata, and related publications.

The application provides public research explorers, linked detail pages, live data visualizations, and a protected administration area for managing catalog records.

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Running the Application](#running-the-application)
- [Application Routes](#application-routes)
- [API Reference](#api-reference)
- [Data Model](#data-model)
- [Search and Filtering](#search-and-filtering)
- [Visualizations](#visualizations)
- [Seed Data](#seed-data)
- [Administration](#administration)
- [Deployment](#deployment)
- [Validation](#validation)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## Features

### Public catalog

- Species explorer with live taxonomy and collection metadata.
- Conopeptide explorer for precursor, superfamily, framework, sequence, and matched-toxin records.
- Biomarker explorer for sequence-bearing biomarker records.
- Publications explorer with linked species, conopeptide, and biomarker counts.
- Detail pages for species, conopeptides, and biomarkers.
- Species detail tabs for conopeptides, specimens, and publications.

### Search and filters

- Search fields across the public explorers and detail tabs.
- Multi-select DaisyUI filter controls.
- Removable selected-value badges.
- Combined filters across multiple groups.
- Enter-to-apply search behavior.
- Reset and apply actions.
- Filter options derived from live catalog rows.
- Pagination applied after filtering.
- Empty, loading, and error states.

### Data visualization

- Visualization landing page with live summary metrics and overview cards.
- Species overview with province coverage, subgenera, and sequencing data.
- Conopeptide overview with superfamily, peptide, and precursor-length summaries.
- Biomarker overview with marker type, coverage, province density, and record tables.
- Shared donut, horizontal bar, vertical bar, and area chart primitives.
- Hover tooltips for chart values, data points, metrics, and ranked records.
- Cross-data insights calculated from the catalog snapshot.

### Administration

- Protected admin login at `/adminlogin`.
- Session-based admin authentication using an HTTP-only signed cookie.
- Admin resource browsing and CRUD operations.
- CSV import support.
- Archive, restore, and permanent-delete operations.
- Dataset import logs.

## Architecture

```text
React + Vite frontend
        |
Frontend API services
        |
Express REST API
        |
Controllers and data models
        |
PostgreSQL database
```

The frontend does not query the database directly. It communicates with the Express API through `frontend/src/services/api.js` and `frontend/src/services/catalogService.js`.

The backend initializes the required database tables, loads private seed data when tables are empty, and exposes catalog, dashboard, taxonomy, and administration routes.

## Repository Structure

```text
.
├── backend/
│   ├── config/              Database, CORS, and resource configuration
│   ├── controllers/         HTTP request handlers
│   ├── middlewares/         Error handling and admin protection
│   ├── models/              Database queries and data mapping
│   ├── routes/              Express route definitions
│   ├── scripts/             Operational and database scripts
│   ├── seed-data/           Private CSV and JSON backup data
│   ├── utils/               Import, backup, response, and query helpers
│   └── server.js            Express application entry point
├── frontend/
│   ├── src/components/      Shared UI components
│   ├── src/features/        Feature-specific pages, components, and controllers
│   ├── src/pages/           Route-level pages
│   ├── src/router/          React Router configuration
│   ├── src/services/        API and catalog service functions
│   └── vite.config.js       Vite configuration
├── .env                     Local environment variables, not committed
├── .env.example             Environment variable template
├── package.json              Backend scripts and dependencies
├── render.yaml               Render backend deployment configuration
└── README.md                 Project documentation
```

## Requirements

- Node.js with npm.
- A PostgreSQL-compatible database. The project is configured for a hosted PostgreSQL database.
- Database credentials or a complete `DATABASE_URL`.
- A modern browser for the React frontend.

## Environment Variables

Create a `.env` file in the repository root. Do not commit it.

```env
PORT=
VITE_SUPABASE_URL=
DATABASE_URL=
PGUSER=
PGPASSWORD=
PGHOST=
PGDATABASE=

CORS_ORIGINS=
ADMIN_API_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=

VITE_API_BASE_URL=
SUPABASE_PUBLIC_BUCKET_URL=
```

### Variable reference

| Variable | Used by | Description |
|---|---|---|
| `PORT` | Backend | HTTP port. Defaults to `3333` locally if not set. |
| `VITE_SUPABASE_URL` | Frontend environment | Reserved client-side project URL. The current frontend reads catalog data through the Express API instead of using this value directly. |
| `DATABASE_URL` | Backend | Preferred PostgreSQL connection string. |
| `PGUSER` | Backend | Fallback PostgreSQL username when `DATABASE_URL` is not set. |
| `PGPASSWORD` | Backend | Fallback PostgreSQL password. |
| `PGHOST` | Backend | Fallback PostgreSQL host. |
| `PGDATABASE` | Backend | Fallback PostgreSQL database name. |
| `CORS_ORIGINS` | Backend | Comma-separated list of allowed frontend origins. |
| `ADMIN_API_KEY` | Backend | Secret key for trusted admin API-key-protected operations. |
| `ADMIN_PASSWORD` | Backend | Password for the admin login page. |
| `ADMIN_SESSION_SECRET` | Backend | Secret used to sign the admin session cookie. |
| `VITE_API_BASE_URL` | Frontend | API base URL, for example `http://localhost:3333/api`. |
| `SUPABASE_PUBLIC_BUCKET_URL` | Backend | Optional public storage base URL used to resolve shell image paths. |

Never expose `DATABASE_URL`, `PGPASSWORD`, `ADMIN_API_KEY`, `ADMIN_PASSWORD`, or `ADMIN_SESSION_SECRET` through a `VITE_` variable.

## Local Setup

Install backend dependencies from the repository root:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

Create the root `.env` file and configure the database connection and allowed frontend origin:

```env
PORT=3333
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
CORS_ORIGINS=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3333/api
```

On startup, the backend creates the required tables and seeds empty tables from private files under `backend/seed-data/json` when available.

## Running the Application

Start the backend from the repository root:

```bash
npm run dev
```

The backend runs on `http://localhost:3333` by default.

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

For a production frontend build:

```bash
cd frontend
npm run build
npm run preview
```

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Home dashboard and project introduction |
| `/species` | Species explorer |
| `/species/:id` | Species detail page and related tabs |
| `/conopeptides` | Conopeptide explorer |
| `/conopeptides/:accession` | Conopeptide detail page |
| `/biomarkers` | Biomarker explorer |
| `/biomarkers/:id` | Biomarker detail page |
| `/publications` | Publications explorer |
| `/visualization` | Visualization landing page |
| `/visualization/species` | Species visualization |
| `/visualization/conopeptides` | Conopeptide visualization |
| `/visualization/biomarkers` | Biomarker visualization |
| `/adminlogin` | Protected admin login |

## API Reference

The backend exposes all public API routes under `/api`.

### Health

```http
GET /api/health
```

### Species

```http
GET /api/species
GET /api/species/filters
GET /api/species/:id
POST /api/species
PUT /api/species/:id
DELETE /api/species/:id
```

Supported list query parameters include `page`, `limit`, `search`, `sortBy`, `order`, `subgenus`, `province`, `municipality`, and `diet`.

Multi-value filters can be sent as comma-separated values:

```text
/api/species?province=Cebu,Bohol&diet=Carnivore,Unknown
```

### Conopeptides

```http
GET /api/conopeptides
GET /api/conopeptides/filters
GET /api/conopeptides/:accession
```

Supported filters include `search`, `species`, `superfamily`, `cysteineFramework`, `hasMaturePeptideSequence`, and `hasPredictedPeptide`.

### Biomarkers

```http
GET /api/biomarkers
GET /api/biomarkers/filters
GET /api/biomarkers/:id
```

Supported filters include `search`, `markerType`, `species`, `province`, `status`, and `hasAccession`.

The public biomarker explorer returns records with usable sequence values. Blank values and unavailable sequence markers are excluded from that public sequence-focused view.

### Publications

```http
GET /api/publications
GET /api/publications/filters
GET /api/publications/:id
```

Supported filters include `search`, `year`, and `journal`.

### Taxonomy

```http
GET /api/taxonomy
GET /api/taxonomy/filters
GET /api/taxonomy/:id
```

### Dashboard summary

```http
GET /api/dashboard/summary
```

This endpoint supplies the live metrics, visualization data, overview card data, recent records, trend data, coverage data, and cross-data insights used by the home and visualization pages.

### Administration

```http
POST /api/admin/login
POST /api/admin/logout
GET /api/admin/session
GET /api/admin/resources
GET /api/admin/dataset-logs
GET /api/admin/:resource
POST /api/admin/:resource
PUT /api/admin/:resource/:id
DELETE /api/admin/:resource/:id
POST /api/admin/:resource/import-csv
POST /api/admin/archive/:archiveId/restore
DELETE /api/admin/archive/:archiveId/permanent
```

Admin routes require the appropriate session cookie or admin API key, depending on the operation.

## Data Model

The database bootstrap creates these primary tables:

### `species`

Species identity, taxonomy, collection locality, sequencing metadata, specimen repositories, image paths, project information, and DOI references.

### `taxonomy`

Taxonomic classification and organism metadata, including class, order, family, genus, subgenus, diet, anatomical sample, and tissue source.

### `conopeptide`

Conopeptide accession, species, gene superfamily, framework, precursor and mature sequences, matched toxin, similarity, expression, length, cysteine information, and DOI.

### `biomarker`

Biomarker identity, species, marker type, locality, accession, sequence, sequence length, validation status, and publication DOI.

### `publication`

Publication identity, title, authors, year, journal, DOI, evidence type, and linked record counts.

### Administrative tables

- `admin_archive`
- `dataset_import_logs`

## Search and Filtering

Explorer filters are backed by live rows returned from the API.

Filtering behavior follows this order:

```text
Live database rows
        ↓
Search term and selected filters
        ↓
Filtered result count
        ↓
Pagination
        ↓
Visible rows
```

The public explorer controls support:

- Multiple selected values within one filter group.
- Multiple filter groups combined together.
- Removable selected-value badges.
- Search submission with the Enter key.
- Reset to the complete unfiltered dataset.
- Empty states when no records match.
- Counts that reflect the filtered dataset.

Blank or missing display values are normalized to `Unavailable` only where the product presentation requires a readable fallback. Blank matched-toxin values are displayed as `Unidentified`.

## Visualizations

### Visualization landing page

The landing page displays:

- Live metric pills.
- Species, conopeptide, and biomarker overview cards.
- Explore buttons linking to visualization subpages.
- Province and coverage trend sections.
- Cross-data insights.

### Species visualization

- Total species.
- Total subgenera.
- Province count.
- Species with sequence data.
- Species distribution by province.
- Top species with sequence data.
- Species by subgenus.
- Sequencing coverage across provinces.

### Conopeptide visualization

- Total precursors.
- Superfamily count.
- Unique peptide count.
- Species with conopeptides.
- Superfamily distribution.
- Precursor length distribution.
- Top abundant conopeptides.

### Biomarker visualization

- Total biomarkers.
- Biomarker type count.
- Species with biomarker data.
- Biomarker coverage percentage.
- Marker type distribution.
- Coverage across species.
- Biomarker density by province.
- Top biomarker records.

All visualization metrics and chart data are generated from the dashboard summary API. The map preview is intentionally kept as a separate visualization asset and is not modified by chart filtering logic.

## Seed Data

Private backup data is stored under `backend/seed-data` and is not served as frontend static content.

Recommended source folders:

```text
backend/seed-data/
├── csv/
│   ├── species/
│   ├── conopeptides/
│   ├── barcodes/
│   ├── publications/
│   └── taxonomic/
└── json/
    ├── species/
    ├── conopeptides/
    ├── barcodes/
    ├── publications/
    └── taxonomic/
```

Generate JSON backups from CSV inputs:

```bash
npm run seed:json
```

Seed the configured database from the private backup data:

```bash
npm run seed:supabase
```

Database bootstrap seeding only inserts records when the corresponding table is empty.

## Administration

Open `/adminlogin` to access the protected administration area.

The admin login uses:

- `ADMIN_PASSWORD` for credential validation.
- `ADMIN_SESSION_SECRET` for signed session cookies.
- HTTP-only cookies for browser sessions.
- Rate limiting for repeated failed login attempts.

Trusted tooling that needs protected write access may use `ADMIN_API_KEY` through the `x-admin-api-key` header where supported.

Do not expose admin credentials or API keys in frontend builds.

## Deployment

### Frontend deployment

The frontend is deployable to Vercel or another static hosting provider.

1. Create a project using the repository.
2. Set the project root to `frontend`.
3. Set `VITE_API_BASE_URL` to the deployed backend API, including `/api`.
4. Build with `npm run build`.
5. Deploy the generated Vite application.

The frontend includes route fallback configuration so React Router routes work on direct navigation and refresh.

### Backend deployment with Render

The repository includes `render.yaml` for an Express web service.

1. Push the repository to GitHub.
2. Create a Render Blueprint from the repository.
3. Configure `DATABASE_URL`, `CORS_ORIGINS`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `ADMIN_API_KEY`, and `SUPABASE_PUBLIC_BUCKET_URL`.
4. Use `/api/health` as the health check.
5. Set the deployed backend URL as the frontend `VITE_API_BASE_URL`.

Example production values:

```env
CORS_ORIGINS=https://your-frontend-domain.example
VITE_API_BASE_URL=https://your-backend-domain.example/api
```

### Docker

`Dockerfile.example` is provided as a starting point for container deployment. Review its placeholder values before using it in any environment and pass secrets through the deployment platform rather than committing them to the image.

## Validation

Build the frontend:

```bash
cd frontend
npm run build
```

Run frontend linting:

```bash
cd frontend
npm run lint
```

Check backend JavaScript syntax:

```bash
node --check backend/server.js
node --check backend/models/dashboardModel.js
```

Manual verification checklist:

- The backend responds at `/api/health`.
- Explorers render live rows.
- Filter options come from live data.
- Multi-select filters combine correctly.
- Enter applies search.
- Reset restores the unfiltered dataset.
- Result counts and pagination match filtered rows.
- Detail tabs render related records.
- Visualization metrics match dashboard data.
- Chart tooltips show the corresponding label and value.
- Empty and error states render correctly.
- The map remains unchanged.

## Security

- Keep `.env` out of version control.
- Keep database credentials backend-only.
- Never prefix backend secrets with `VITE_`.
- Do not place `ADMIN_API_KEY` in frontend environment variables.
- Use HTTPS in production.
- Restrict `CORS_ORIGINS` to trusted frontend origins.
- Keep private seed JSON outside `frontend/public`.
- Rotate admin secrets if they are exposed.

## Troubleshooting

### The frontend cannot reach the API

Check that the backend is running and that `VITE_API_BASE_URL` points to the correct API base, for example:

```env
VITE_API_BASE_URL=http://localhost:3333/api
```

### CORS errors appear in the browser

Add the frontend origin to `CORS_ORIGINS`:

```env
CORS_ORIGINS=http://localhost:5173
```

Restart the backend after changing environment variables.

### Database initialization fails

Verify either `DATABASE_URL` or all fallback PostgreSQL variables are configured:

```env
DATABASE_URL=
PGUSER=
PGPASSWORD=
PGHOST=
PGDATABASE=
```

### Shell images do not load

Configure `SUPABASE_PUBLIC_BUCKET_URL` when shell image values are stored as public storage paths. The stored path is retained as a fallback when the public bucket URL is absent.

### A visualization has no data

Check `/api/dashboard/summary`, verify that the related database table contains rows, and inspect the browser network response for the dashboard request. The frontend intentionally displays an empty state instead of fabricating chart data.

## License

No project license is currently declared in the repository.

## Developers

The project is maintained by:

- Backend Developer: Timothy James Guela
- Fullstack Developer: Rei Jansen Buerom
- Data Modeller: Bianca Germaine Manatad
- Mentors: Dan Jethro Masacupan, Lamberto Fonseca Jr., Gliezel Ann Pajarilla

For bug reports, data corrections, or collaboration requests, contact the relevant developers through the repository issue tracker or the project’s designated communication channel.
