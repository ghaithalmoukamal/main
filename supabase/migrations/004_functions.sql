-- ============================================================
-- Server-side helpers: scoring, fraud, audit
-- ============================================================

-- Auto-expire waiting leads
CREATE OR REPLACE FUNCTION expire_waiting_leads() RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE leads
  SET status = 'expired', updated_at = now()
  WHERE status = 'waiting'
    AND waiting_until IS NOT NULL
    AND waiting_until < now();
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

-- Reliability metrics for a craftsman (firm-only RPC)
CREATE OR REPLACE FUNCTION reliability_metrics(p_craftsman_id UUID)
RETURNS TABLE (
  approval_rate NUMERIC,
  completion_rate NUMERIC,
  avg_response_minutes NUMERIC,
  on_time_rate NUMERIC,
  total_jobs INTEGER
)
LANGUAGE SQL STABLE AS $$
  WITH lead_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE status NOT IN ('pending','expired'))::NUMERIC AS responded,
      COUNT(*)::NUMERIC AS total,
      COUNT(*) FILTER (WHERE status IN ('approved','in_progress','completed_by_craftsman','completed'))::NUMERIC AS approved,
      COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC AS completed,
      COUNT(*) FILTER (WHERE status IN ('approved','in_progress','completed_by_craftsman','completed'))::INTEGER AS jobs,
      AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60.0)
        FILTER (WHERE status IN ('approved','declined')) AS avg_resp
    FROM leads
    WHERE craftsman_id = p_craftsman_id
  )
  SELECT
    CASE WHEN total > 0 THEN ROUND(approved / total * 100, 1) ELSE 0 END,
    CASE WHEN approved > 0 THEN ROUND(completed / approved * 100, 1) ELSE 0 END,
    COALESCE(ROUND(avg_resp::NUMERIC, 0), 0),
    -- on_time_rate: placeholder until we track expected_completion
    CASE WHEN approved > 0 THEN ROUND(completed / approved * 100, 1) ELSE 0 END,
    COALESCE(jobs, 0)
  FROM lead_stats;
$$;

-- Auto-suspend on report threshold trigger
CREATE OR REPLACE FUNCTION check_report_threshold() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE
  open_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO open_count
  FROM reports
  WHERE target_entity_type = NEW.target_entity_type
    AND target_entity_id = NEW.target_entity_id
    AND status = 'open';
  IF open_count >= 3 THEN
    IF NEW.target_entity_type = 'craftsman' THEN
      UPDATE craftsmen SET approval_status = 'pending'
      WHERE id::TEXT = NEW.target_entity_id;
    ELSIF NEW.target_entity_type = 'company' THEN
      UPDATE companies SET approval_status = 'pending'
      WHERE id::TEXT = NEW.target_entity_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER reports_auto_suspend
  AFTER INSERT ON reports
  FOR EACH ROW EXECUTE FUNCTION check_report_threshold();

-- Audit log helper (called from server-side admin actions)
CREATE OR REPLACE FUNCTION write_audit(
  p_actor UUID, p_action TEXT, p_entity_type TEXT, p_entity_id TEXT,
  p_before JSONB, p_after JSONB, p_notes TEXT
) RETURNS BIGINT
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_id BIGINT;
BEGIN
  INSERT INTO audit_log (actor_id, action, entity_type, entity_id, before, after, notes)
  VALUES (p_actor, p_action, p_entity_type, p_entity_id, p_before, p_after, p_notes)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Detect duplicate phone fraud signal
CREATE OR REPLACE FUNCTION scan_duplicate_phones() RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
  rec RECORD;
  inserted INTEGER := 0;
BEGIN
  FOR rec IN
    SELECT phone, array_agg(id::TEXT) AS ids
    FROM craftsmen
    WHERE phone IS NOT NULL
    GROUP BY phone
    HAVING count(*) > 1
  LOOP
    INSERT INTO fraud_flags (entity_type, entity_id, signal, severity, raw_data)
    SELECT 'craftsman', unnest(rec.ids), 'duplicate_phone', 'high',
           jsonb_build_object('phone', rec.phone, 'duplicates', rec.ids)
    ON CONFLICT DO NOTHING;
    inserted := inserted + 1;
  END LOOP;
  RETURN inserted;
END;
$$;
