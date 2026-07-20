# ConoPH

A proof-of-concept database that integrates `species taxonomy`, `collection metadata`, `molecular sequence data`, `functional annotations`, and `publication records` for Philippine cone snails and their conopeptides.

## Vercel Deployment

The frontend is Vercel-ready in the `frontend` directory.

1. Create the Vercel project from this repository.
2. Set the root directory to `frontend`.
3. Add `VITE_API_BASE_URL` in Vercel to point to the deployed backend API.
4. Deploy the frontend.

The backend is an Express server and should be deployed separately.

## Backend Development Setup

**.env setup**

1. Create `.env`
2. Update `.env` following the format from `.env.example`
3. Paste your Supabase Postgres connection string into `DATABASE_URL`
4. Set `CORS_ORIGINS` to the frontend origins allowed to call the API
5. Set `ADMIN_API_KEY` if you need to use protected write routes
6. Run `npm install` in the repo root
7. Run `npm run dev`

The backend now exposes MVC-style routes under `/api`:
- `/api/species`
- `/api/conopeptides`
- `/api/biomarkers`
- `/api/publications`
- `/api/taxonomy`
- `/api/dashboard/summary`

The database bootstrap creates the required tables and seeds them from backend-private JSON files in `backend/seed-data/json` if the tables are empty. These files are not served by the frontend.

To reseed Supabase manually from the private seed JSON files, run:

```powershell
npm run seed:supabase
```

## Security Notes

The frontend reads data through the Express API only. Raw seed JSON is kept out of `frontend/public` so users cannot download it as a static browser asset.

Species write routes are protected with `x-admin-api-key`. Do not put `ADMIN_API_KEY` in frontend environment variables.

## Dockerfile Setup

1. Rename `Dockerfile.example` to `Dockerfile`
2. Update ENV variables (if any) according to your `.env`
3. Once done,
    - run `docker build -t <SOME_NAME>:<OPTIONAL_TAG> .`
        - e.g `docker buid -t my_backend:v0 .`. NOTE: if tag is left undeclared, default value is `latest`.
    - run `docker run -p <PORT_INT>:<PORT_INT> <NAME_CHOSEN>:<OPTIONAL_TAG>`
        - e.g. `docker run -p 9999:9999 my_backend:latest`  
4. Important to keep in mind that whatever port number is `EXPOSED` in the `Dockerfile`, it must also be used in the `port-forwarding` (the -p 9999:9999 thingy)
