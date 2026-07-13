# ConoPH Frontend

This folder contains the Vite React app intended for Vercel deployment.

## Vercel setup

1. Create a Vercel project from this repository.
2. Set the project root to `frontend`.
3. Add `VITE_API_BASE_URL` as an environment variable that points to the deployed backend API, for example `https://your-api-domain.example.com/api`.
4. Deploy.

The included [`vercel.json`](./vercel.json) rewrites all client-side routes to `index.html` so React Router works on refresh and direct links.

## Local development

1. Run `npm install` in `frontend`.
2. Run `npm run dev`.
