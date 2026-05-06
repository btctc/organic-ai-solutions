CREATE TABLE assessment_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  prospect_email TEXT,
  prospect_name TEXT,
  business_name TEXT,
  industry TEXT,
  team_size TEXT,
  budget_signal TEXT,
  timeline_signal TEXT,
  pain_points TEXT[],
  recommended_package TEXT,
  conversation_json JSONB NOT NULL,
  report_html TEXT,
  ip_address INET,
  status TEXT NOT NULL DEFAULT 'in_progress'
);
CREATE INDEX idx_assessment_email ON assessment_conversations(prospect_email);
CREATE INDEX idx_assessment_created ON assessment_conversations(created_at DESC);

CREATE TABLE assessment_rate_limits (
  ip_address INET PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assessment_budget (
  id INT PRIMARY KEY DEFAULT 1,
  month_start TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', now()),
  estimated_cost_usd NUMERIC NOT NULL DEFAULT 0,
  CONSTRAINT singleton CHECK (id = 1)
);
INSERT INTO assessment_budget (id) VALUES (1) ON CONFLICT DO NOTHING;

ALTER TABLE assessment_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_budget ENABLE ROW LEVEL SECURITY;
