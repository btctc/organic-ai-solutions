CREATE TABLE audit_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES assessment_conversations(id) ON DELETE CASCADE,
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  used_at TIMESTAMPTZ
);

CREATE INDEX idx_audit_triggers_token ON audit_triggers(token);
CREATE INDEX idx_audit_triggers_conversation ON audit_triggers(conversation_id);

ALTER TABLE audit_triggers ENABLE ROW LEVEL SECURITY;
