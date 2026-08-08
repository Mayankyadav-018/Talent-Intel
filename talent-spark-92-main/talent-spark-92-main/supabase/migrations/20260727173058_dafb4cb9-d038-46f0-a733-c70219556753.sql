
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  github_username TEXT,
  resume_data JSONB DEFAULT '{}'::jsonb,
  github_metrics JSONB DEFAULT '{}'::jsonb,
  hackathon_data JSONB DEFAULT '[]'::jsonb,
  verification_flags JSONB DEFAULT '{}'::jsonb,
  ai_talent_score NUMERIC DEFAULT 0,
  score_breakdown JSONB DEFAULT '{}'::jsonb,
  summary TEXT DEFAULT '',
  embedding JSONB DEFAULT '[]'::jsonb,
  resume_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidates TO authenticated;
GRANT ALL ON public.candidates TO service_role;

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read candidates" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Public insert candidates" ON public.candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update candidates" ON public.candidates FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete candidates" ON public.candidates FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.tg_candidates_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER candidates_updated_at BEFORE UPDATE ON public.candidates
FOR EACH ROW EXECUTE FUNCTION public.tg_candidates_updated_at();
