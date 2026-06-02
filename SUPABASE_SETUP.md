# InternFlow (React) — Supabase Integration

Your React app reads & writes all data to **Supabase**. Below is exactly how
to make it persist (your tables already exist, so you only need the fix script).

## 🔐 Security first (do this now)
You shared your **database password** publicly. **Reset it** in
`Supabase → Project Settings → Database → Reset database password`.
The React app does NOT use that password (only the public anon key), so
resetting won't break anything here.

## ✅ Step 1 — Run the fix migration (REQUIRED)
Your existing tables have **foreign-key constraints** and possibly **RLS**,
which silently block the app's writes. Fix it once:

1. Open **Supabase → SQL Editor → New query**.
2. Paste the contents of **`fix-existing-supabase.sql`** (project root).
3. Click **Run**.

This removes FK constraints, disables RLS, and grants the anon key access.
It does **not** delete any data.

> Why FKs are removed: the browser syncs each table independently and in
> parallel, so a `student` row can reach the DB a split-second before its
> `user` row — a FK would reject it. The app keeps integrity in code instead.

## ✅ Step 2 — Keys are already wired
`src/lib/supabase.ts` already contains your Project URL and anon/publishable
key. Nothing to configure.

## ✅ Step 3 — Run the app
- `npm run dev`, or `npm run build` then serve `dist/`.
- You'll briefly see **“Connecting to InternFlow…”** while it loads from Supabase.

## ✅ Step 4 — Create the first admin
- Go to **/setup** (or use the prompt on the login page) → create the
  **super administrator**.
- Now check Supabase → **Table Editor → users** → your admin row is there. 🎉
- Everyone else self-registers at **/register**. The superadmin creates other
  admins from inside the dashboard.

## 🔎 If something doesn't save
Errors are now shown **on screen** (red toast, bottom-right) and in the
browser console. Common messages:
| Message | Cause | Fix |
|--------|-------|-----|
| `permission denied for table …` | RLS still on / no grant | Re-run `fix-existing-supabase.sql` |
| `violates foreign key constraint` | FKs still present | Re-run the fix script |
| `column "read" … does not exist` | old build | rebuild (the app maps `read`→`is_read`) |
| `Failed to fetch` | wrong URL / offline | check `src/lib/supabase.ts` URL |

## How it works
- `src/lib/supabase.ts` — Supabase client (URL + anon key).
- `src/lib/useSupabaseTable.ts` — loads a table once, then auto-syncs every
  add/update/delete; supports field mapping (used for `read`↔`is_read`) and
  emits visible errors.
- `AuthContext` / `DataContext` — backed by Supabase. Your login session is
  remembered locally so refresh keeps you signed in.

## MVP notes
- Auth is a lightweight check against the `users` table (plain-text passwords).
  For production, migrate to **Supabase Auth** + RLS policies.
- IDs are app-generated integers; all writes must go through the app (don't
  hand-insert rows in the dashboard or IDs may collide).
