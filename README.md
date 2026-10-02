# GeoJournaling

React/Vite trading journal starter with Supabase Auth + PostgreSQL/RLS.

## Local
`npm install` → copy `.env.example` to `.env` → add Supabase URL/anon key → `npm run dev`.

Run `supabase.sql` in Supabase SQL Editor, enable Email/Password Auth, then deploy the `dist` folder to Cloudflare Pages.

Cloudflare Pages: build command `npm run build`, output `dist`. Project name: `geojournaling`.
