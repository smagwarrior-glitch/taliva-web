# TALIVA

TALIVA is an early-stage sports talent discovery and funding platform. The current MVP lets athletes submit a demo application and lets investors browse athlete profiles, view milestone-based escrow stages, and try a simulated investment flow.

## Current scope

- Persian and English interface
- Athlete directory and profile pages
- Demo athlete application with client-side validation
- Demo investor dashboard
- Accessible demo investment dialog
- Shared typed athlete data
- Next.js App Router deployment on Vercel

> This repository is still a demo. Authentication, persistent storage, real payments, smart contracts, and production compliance are not implemented yet.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel

## Local development

Requirements:

- Node.js 22 or newer
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run build
```

Pull requests run the same checks through GitHub Actions.

## Main routes

- `/` — bilingual landing page
- `/investor/athletes` — athlete directory
- `/athlete/[id]` — athlete profile
- `/athlete/apply` — demo application form
- `/investor/dashboard` — demo investor portfolio

Use `?lang=fa` or `?lang=en` to select the interface language.

## Next milestones

1. Add authentication and role-based access.
2. Add a database and server-side form submission.
3. Replace sample athletes and portfolio records with persisted data.
4. Design and audit the escrow smart contract on a testnet.
5. Add automated unit, integration, and end-to-end tests.
6. Complete security, privacy, legal, and accessibility reviews before real-money use.
