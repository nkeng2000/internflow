import { createClient } from '@supabase/supabase-js';

// ====================================================================
// SUPABASE CLIENT — InternFlow
// ====================================================================
// Two ways to configure the keys (env vars take priority):
//
// 1) Recommended: create a .env file in the project root with:
//      VITE_SUPABASE_URL=https://scobcfqekwmeznopmehw.supabase.co
//      VITE_SUPABASE_ANON_KEY=eyJ...  (your LEGACY anon JWT key)
//    Then restart `npm run dev`.
//
// 2) Or just edit the FALLBACK_* constants below.
//
// 🔑 WHICH KEY TO USE
//   Supabase has TWO formats of public keys:
//     a) Legacy anon JWT  -> starts with "eyJ"     (✅ RECOMMENDED — always works)
//     b) New publishable  -> starts with "sb_publishable_"
//
//   The publishable key has known compatibility issues with PostgREST in some
//   projects (you'll see "Invalid API key" errors). USE THE LEGACY ANON KEY.
//
//   Where to find the legacy key in your dashboard:
//     Project Settings → API → "Project API keys" → anon  public  → eyJhbGc...
//     (If you only see the new format, click the "Legacy API keys" tab.)
// ====================================================================

const FALLBACK_URL = 'https://scobcfqekwmeznopmehw.supabase.co';
// Legacy anon JWT key (safe to ship in client code — it's the PUBLIC key).
// ⚠️ NEVER paste a service_role key here — that key is a SECRET and would
//    expose full admin access to your database.
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb2JjZnFla3dtZXpub3BtZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDU5NjAsImV4cCI6MjA5NTg4MTk2MH0.p2NZ3mZn8_I9yj1LlToli3Tl4pzI6tP4XF9VtbvFM8M';

const env = (import.meta as any).env ?? {};
const SUPABASE_URL: string = env.VITE_SUPABASE_URL || FALLBACK_URL;
const SUPABASE_ANON_KEY: string = env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

// Friendly diagnostic if the key looks wrong — shown in console AND as a toast.
function warn(msg: string) {
  console.error('[Supabase config]', msg);
  // Fire after a tick so the Toaster component is mounted.
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('supabase-error', { detail: msg }));
  }, 500);
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('PASTE_YOUR')) {
  warn('No Supabase anon key set. Edit src/lib/supabase.ts (or create .env with VITE_SUPABASE_ANON_KEY).');
} else if (SUPABASE_ANON_KEY.startsWith('sb_publishable_')) {
  warn('You are using a "sb_publishable_" key, which often returns "Invalid API key". Switch to the LEGACY anon JWT key (starts with "eyJ"). See Supabase → Settings → API → Legacy API keys.');
} else if (SUPABASE_ANON_KEY.startsWith('sb_secret_')) {
  warn('You pasted a SECRET key in client code — this is dangerous and will not work. Use the public anon key instead.');
} else if (!SUPABASE_ANON_KEY.startsWith('eyJ')) {
  warn('Your Supabase key does not look like a valid JWT. Make sure you copied the full anon key.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // app uses a lightweight custom auth (users table)
  },
});

// Table name constants (kept here so renames are one-line changes)
export const TABLES = {
  users: 'users',
  students: 'students',
  companies: 'companies',
  supervisors: 'supervisors',
  internships: 'internships',
  applications: 'applications',
  placements: 'placements',
  weekly_reports: 'weekly_reports',
  evaluations: 'evaluations',
  notifications: 'notifications',
} as const;
