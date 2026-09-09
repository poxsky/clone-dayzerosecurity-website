# 0DAY Research Team — website

Marketing site for **0DAY Research Team** ([0daysecurity.tech](https://0daysecurity.tech)):
Next.js (App Router) + Tailwind CSS + Drizzle ORM on PostgreSQL.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4**
- **Drizzle ORM** + **PostgreSQL** (Neon / Supabase / local)
- Quote requests are stored in the `quote_requests` table; optional email
  notification via [Resend](https://resend.com)
- Fonts (Anonymous Pro, Roboto Mono) are self-hosted under `src/fonts/`
  (OFL-licensed) — builds have no network dependency on Google Fonts

## Local development

```bash
npm install
cp .env.example .env      # then set DATABASE_URL
npm run db:migrate        # apply Drizzle migrations
npm run dev               # http://localhost:3000
```

## Database setup (pick one)

**Neon** (recommended free tier):

1. Create a project at <https://neon.tech>
2. Copy the **pooled** connection string from the project dashboard
   (append `?sslmode=require`)
3. Put it in `.env` as `DATABASE_URL`

**Supabase**:

1. Create a project at <https://supabase.com>
2. Project Settings → Database → Connection string → **Transaction pooler**
   (port 6543)
3. Put it in `.env` as `DATABASE_URL`

**Local PostgreSQL**: anything like
`postgresql://postgres:postgres@127.0.0.1:5432/app_db` works.

Then apply the schema:

```bash
npm run db:migrate
```

> The quotes API also creates the table on first submission
> (`CREATE TABLE IF NOT EXISTS`) as a safety net, but migrations are the
> source of truth.

## Migration workflow

```bash
# after editing src/db/schema.ts
npm run db:generate   # generate SQL in ./drizzle
npm run db:migrate    # apply to the database in DATABASE_URL
npm run db:studio     # optional: browse data in Drizzle Studio
```

## Email notifications for the quote form (optional)

By default, submissions are only stored in the database — check them with
`npm run db:studio` or any SQL client. To also receive an email for every
submission at anmol@0daysecurity.tech:

1. Create a free [Resend](https://resend.com) account
2. Verify the `0daysecurity.tech` domain (Domains → Add Domain)
3. Set in `.env` (or Vercel project env vars):

```
RESEND_API_KEY=re_xxxxxxxxxxxx
QUOTE_NOTIFY_FROM=0DAY Research Team <no-reply@0daysecurity.tech>
QUOTE_NOTIFY_EMAIL=anmol@0daysecurity.tech
```

Email failures never break the form — the database row is always written first.

## Scripts

| Command             | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Dev server                      |
| `npm run build`     | Production build                |
| `npm run start`     | Serve the production build      |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | TypeScript, no emit             |
| `npm run db:generate` | Generate migrations from schema |
| `npm run db:migrate`  | Apply migrations                |
| `npm run db:push`     | Push schema directly (no migration files) |
| `npm run db:studio`   | Database GUI                    |

## Deploying to Vercel

1. Push this repository to GitHub
2. Vercel → **Add New… → Project** → import the repo (framework is
   auto-detected as Next.js)
3. Add environment variables:
   - `DATABASE_URL` — your Neon/Supabase connection string (required)
   - `RESEND_API_KEY`, `QUOTE_NOTIFY_FROM`, `QUOTE_NOTIFY_EMAIL` — optional
     email notifications (see above)
4. Deploy
5. Run the migrations once against the production database:
   `DATABASE_URL="<production url>" npm run db:migrate`
6. Vercel → Project → **Settings → Domains** → add `0daysecurity.tech` and
   `www.0daysecurity.tech`, then follow the DNS instructions:
   - apex domain: `A` record → `76.76.21.21`
   - www: `CNAME` record → `cname.vercel-dns.com`
7. Verify HTTPS is provisioned (automatic once DNS propagates)

## Health check

`GET /api/health` returns database connectivity status — useful for a
post-deploy smoke test.
