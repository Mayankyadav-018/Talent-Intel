DROP POLICY IF EXISTS "Public delete candidates" ON public.candidates;
DROP POLICY IF EXISTS "Public insert candidates" ON public.candidates;
DROP POLICY IF EXISTS "Public read candidates" ON public.candidates;
DROP POLICY IF EXISTS "Public update candidates" ON public.candidates;

REVOKE ALL ON public.candidates FROM anon;
REVOKE ALL ON public.candidates FROM authenticated;
GRANT ALL ON public.candidates TO service_role;

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;