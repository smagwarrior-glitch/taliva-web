# TALIVA

TALIVA is an early-stage sports talent discovery and funding platform. The MVP lets athletes submit a demo application and lets investors browse athlete profiles, manage an account, view milestone-based escrow stages, and try a simulated investment flow.

## Current scope

- Persian and English interface
- Athlete directory and profile pages backed by sample data
- Demo athlete application with client-side validation
- Supabase email/password authentication for investors
- PostgreSQL schema for profiles, investments, escrow milestones, and audit events
- Row Level Security for investor-owned data
- Authenticated investor dashboard with a safe demo fallback before Supabase activation
- Accessible demo investment dialog
- GitHub Actions validation and Vercel deployment

> Real payments and smart contracts are not implemented. Athlete persistence is intentionally deferred to a later migration.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth and PostgreSQL
- Vercel

## Local development

Requirements:

- Node.js 22 or newer
- npm

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site continues to show demo dashboard data until the Supabase environment variables are configured. See [docs/DATABASE.md](docs/DATABASE.md) for database activation.

## Quality checks

```bash
npm run lint
npm run build
```

Pull requests run the same checks through GitHub Actions.

## Main routes

- `/` — bilingual landing page
- `/auth` — investor sign-up and sign-in
- `/investor/athletes` — athlete directory
- `/athlete/[id]` — athlete profile
- `/athlete/apply` — demo application form
- `/investor/dashboard` — authenticated investor portfolio after Supabase activation

Use `?lang=fa` or `?lang=en` to select the interface language.

## Next milestones

1. Create and connect the athlete database.
2. Add server-side investment creation after the smart-contract workflow is defined.
3. Design and audit the escrow smart contract on a testnet.
4. Add automated unit, integration, and end-to-end tests.
5. Complete security, privacy, legal, and accessibility reviews before real-money use.
