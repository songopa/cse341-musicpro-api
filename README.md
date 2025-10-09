# MusicPro — music-catalog-api

This repository contains a small Node.js/Express API for the MusicPro catalog: record labels, genres, albums and user reviews. The API supports full CRUD for resources and uses OAuth (via `express-openid-connect`) for authentication. The project uses the native `mongodb` driver to talk to MongoDB.

This README covers how to configure, run and test the project locally.

## What’s included

- `server.js` — main Express application wired with `express-openid-connect` and resource routes
- `config/` — `auth.js` (OIDC config) and `db.js` (MongoDB connection helper)
- `routes/` — route definitions for `auth`, `labels`, `genres`, `albums`, `reviews`
- `controllers/` — controller implementations (use `config/db.getDb()` and collection operations)
- `models/` — all models
- `middleware/` — validation, authz stubs, global error handler
- `tests/` — Jest + Supertest unit tests (they mock `config/db.getDb()` so they run without a DB)

## Requirements

- Node.js 18+ (recommended)
- MongoDB (for running the server against a real DB)

## Environment

Create a `.env` file (a sample is included) with the following variables:

- `PORT` — port to run the server (default: 3000)
- `MONGODB_URI` — e.g. `mongodb://localhost:27017/musicpro`
- `AUTH_SECRET` — a random string used by `express-openid-connect`
- `AUTH_BASE_URL` — base URL your app is served at (e.g. `http://localhost:3000`)
- `AUTH_CLIENT_ID` — your OIDC client id
- `AUTH_ISSUER_BASE_URL` — issuer base URL (Auth0, etc.)

Example `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/musicpro
AUTH_SECRET=change-me
AUTH_BASE_URL=http://localhost:3000
AUTH_CLIENT_ID=your-client-id
AUTH_ISSUER_BASE_URL=https://your-issuer.example.com
```

## Install

From the project root:

```powershell
npm install
```

## Run (development)

Start the app (will attempt to connect to MongoDB):

```powershell
npm run dev
```

> The server will not attempt a DB connection when `NODE_ENV=test` (this is intentional so unit tests don't require a running DB). The `config/db.js` exposes `connectToDb()` and `getDb()` for use by controllers.

## Tests

Unit tests are implemented with Jest and Supertest and are configured to mock `config/db.getDb()`. Run:

```powershell
npm test
```

If you want integration tests against a real MongoDB, set up a test database and either remove or adapt the mocks in `tests/`.

## Notes about authentication & authorization

- The app uses `express-openid-connect` (see `config/auth.js`) — you must fill real auth environment variables in `.env` to enable real login flows.


