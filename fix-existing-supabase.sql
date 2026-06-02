-- ====================================================================
-- INTERNFLOW — FIX EXISTING SUPABASE FOR THE REACT APP
-- Run this ONCE in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ====================================================================
-- Your tables already exist (with enums, is_read, and FK constraints).
-- This migration makes them work with the React client by:
--   1) Removing FK constraints (the app writes tables independently &
--      in parallel, so FKs cause insert-ordering failures). The app
--      maintains referential integrity in code.
--   2) Disabling RLS so the anon/publishable key can read & write.
--   3) Granting privileges to the anon & authenticated roles.
-- It does NOT delete any data.
-- ====================================================================

-- 1) Drop foreign key constraints (names from your schema)
ALTER TABLE public.students       DROP CONSTRAINT IF EXISTS fk_student_user;
ALTER TABLE public.companies      DROP CONSTRAINT IF EXISTS fk_company_user;
ALTER TABLE public.supervisors    DROP CONSTRAINT IF EXISTS fk_supervisor_user;
ALTER TABLE public.internships    DROP CONSTRAINT IF EXISTS fk_internship_company;
ALTER TABLE public.applications   DROP CONSTRAINT IF EXISTS fk_app_student;
ALTER TABLE public.applications   DROP CONSTRAINT IF EXISTS fk_app_internship;
ALTER TABLE public.placements     DROP CONSTRAINT IF EXISTS fk_placement_student;
ALTER TABLE public.placements     DROP CONSTRAINT IF EXISTS fk_placement_internship;
ALTER TABLE public.placements     DROP CONSTRAINT IF EXISTS fk_placement_supervisor;
ALTER TABLE public.weekly_reports DROP CONSTRAINT IF EXISTS fk_report_placement;
ALTER TABLE public.evaluations    DROP CONSTRAINT IF EXISTS fk_evaluation_placement;
ALTER TABLE public.notifications  DROP CONSTRAINT IF EXISTS fk_notif_user;

-- 2) Disable Row Level Security (MVP: anon key may read/write)
ALTER TABLE public.users          DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students       DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies      DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisors    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements     DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications  DISABLE ROW LEVEL SECURITY;

-- 3) Grant table + sequence privileges to the API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

-- Done. Reload the app; creating accounts will now persist to Supabase.
-- ====================================================================
-- SECURITY NOTE (for later / production):
-- Disabling RLS makes data readable/writable by anyone with the public
-- key. For a real deployment, switch to Supabase Auth and add RLS
-- policies. For an MVP/demo this is acceptable.
-- ====================================================================
