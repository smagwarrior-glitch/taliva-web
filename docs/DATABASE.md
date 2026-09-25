# TALIVA database setup

The current database foundation covers users, investor profiles, investments, escrow milestones, and investment events. Athlete persistence is intentionally deferred.

## 1. Create the Supabase project

Create a Supabase project and keep email/password authentication enabled.

## 2. Apply the migration

Open the Supabase SQL editor and run:

`supabase/migrations/20260925123000_core_non_athlete.sql`

The migration creates:

- `profiles`
- `investments`
- `escrow_milestones`
- `investment_events`
- automatic investor profile creation
- automatic 10% / 20% / 30% / 40% escrow stages
- Row Level Security policies and restricted grants

No athlete table is created. `investments.athlete_reference` temporarily stores the existing athlete ID.

## 3. Add environment variables

Copy the values from Supabase project settings into local `.env.local` and Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Never commit secret or service-role keys.

## 4. Configure authentication URLs

In Supabase Authentication URL settings, set the production Site URL to the TALIVA production domain. Add localhost and Vercel preview URLs only when needed for development.

## 5. Redeploy

Redeploy after adding the Vercel environment variables. Once configured:

- `/auth` provides investor sign-up and sign-in.
- `/investor/dashboard` requires authentication.
- sessions use secure HTTP-only cookies and automatic refresh.
- the dashboard reads only the signed-in investor's rows through RLS.

## Admin accounts

New users always receive the `investor` role. Promote an administrator manually in the Supabase SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = 'USER_UUID';
```

Do not accept an admin role from registration metadata.
