# ConoPH

A proof-of-concept database that integrates `species taxonomy`, `collection metadata`, `molecular sequence data`, `functional annotations`, and `publication records` for Philippine cone snails and their conopeptides.

## Backend Development Setup

**.env setup**

1. Create `.env`
2. Update `.env` following format from`.env.example` which is taken from the [Neon Postgres Website](console.neon.tech)

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
