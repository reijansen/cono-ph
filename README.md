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
3. If you are using Supabase, paste the Postgres connection string from your Supabase project settings into `DATABASE_URL`
4. If you prefer split fields instead, fill in `PGHOST`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`

**run backend**

1. Make sure you are in the root of your directory
2. run `npm install`
3. run `npm run dev`

## Dockerfile Setup

1. Rename `Dockerfile.example` to `Dockerfile`
2. Update ENV variables (if any) according to your `.env`
3. Once done,
    - run `docker build -t <SOME_NAME>:<OPTIONAL_TAG> .`
        - e.g `docker buid -t my_backend:v0 .`. NOTE: if tag is left undeclared, default value is `latest`.
    - run `docker run -p <PORT_INT>:<PORT_INT> <NAME_CHOSEN>:<OPTIONAL_TAG>`
        - e.g. `docker run -p 9999:9999 my_backend:latest`  
4. Important to keep in mind that whatever port number is `EXPOSED` in the `Dockerfile`, it must also be used in the `port-forwarding` (the -p 9999:9999 thingy)
