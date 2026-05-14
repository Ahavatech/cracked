# Cracked.dev

Full-stack Cracked.dev v1 built with Next.js 14, Express, PostgreSQL, and Nodemailer.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy env examples and fill in real values:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

3. Run migrations against your hosted PostgreSQL database:

```bash
pnpm db:migrate
```

4. Seed the first superadmin:

```bash
pnpm db:seed
```

5. Start both apps:

```bash
pnpm dev
```

The web app runs on `http://localhost:3000`; the API runs on `http://localhost:4000`.
