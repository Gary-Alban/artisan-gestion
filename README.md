# Artisan Gestion - Audit pre-acquisition

MVP SaaS Next.js pour l'auto-audit pre-acquisition de fonds de commerce.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + DB
- Resend
- SheetJS
- Vitest

## Installation

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Supabase

1. Creer le projet Supabase.
2. Appliquer `supabase/migrations/001_initial_schema.sql`.
3. Renseigner les variables `.env.local`.
4. Importer les donnees :

```bash
npm run seed
```

## Tests

```bash
npm test
```
