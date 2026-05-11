-- ============================================================
-- Migration 003: New roles — Contractor, Homeowner, Firm subdivision
-- ============================================================

-- 1. Expand the role CHECK constraint on profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN (
    'admin', 'moderator', 'worker',  -- internal staff (worker = admin reviewer, NOT a craftsman)
    'supplier',
    'craftsman',                     -- the Maalem (المعلم)
    'firm',
    'contractor',                    -- NEW: project-level professional
    'homeowner',                     -- NEW: private B2C customer
    'user'
  ));

-- ============================================================
-- 2. Contractors table
-- A contractor is a project-level professional: searchable and
-- hirable (like a Maalem) AND able to post jobs/recruit Maalems
-- (like a firm). Can be an individual or small company.
-- ============================================================
CREATE TABLE IF NOT EXISTS contractors (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  city_id           INTEGER     REFERENCES cities(id),
  name              TEXT        NOT NULL,
  name_ar           TEXT,
  type              TEXT        NOT NULL DEFAULT 'individual'
                                CHECK (type IN ('individual', 'company')),
  -- specializations: e.g. ['civil', 'finishing', 'MEP', 'interior']
  specialization    TEXT[]      DEFAULT '{}',
  bio_ar            TEXT,
  bio_en            TEXT,
  phone             TEXT,
  whatsapp          TEXT,
  instagram         TEXT,
  facebook          TEXT,
  website           TEXT,
  photo_url         TEXT,
  logo_url          TEXT,
  latitude          DOUBLE PRECISION,
  longitude         DOUBLE PRECISION,
  location_name     TEXT,
  years_experience  INTEGER,
  team_size_min     INTEGER,    -- minimum team size they can field
  team_size_max     INTEGER,    -- maximum team size they can field
  approval_status   TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (approval_status IN ('pending','approved','rejected')),
  approved_by       UUID        REFERENCES profiles(id),
  is_verified       BOOLEAN     NOT NULL DEFAULT FALSE,
  is_elite          BOOLEAN     NOT NULL DEFAULT FALSE,
  status            TEXT        NOT NULL DEFAULT 'open'
                                CHECK (status IN ('open','busy')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for search
CREATE INDEX IF NOT EXISTS contractors_city_idx ON contractors(city_id);
CREATE INDEX IF NOT EXISTS contractors_status_idx ON contractors(status, approval_status);

-- ============================================================
-- 3. Contractor ↔ Maalem collaboration links
-- Contractors can showcase Maalems they've worked with on their
-- public profile, and vice versa.
-- ============================================================
CREATE TABLE IF NOT EXISTS contractor_craftsmen (
  contractor_id     UUID        REFERENCES contractors(id) ON DELETE CASCADE,
  craftsman_id      UUID        REFERENCES craftsmen(id) ON DELETE CASCADE,
  collaboration_type TEXT       DEFAULT 'worked_together'
                                CHECK (collaboration_type IN ('worked_together','regular_team','occasional')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (contractor_id, craftsman_id)
);

-- ============================================================
-- 4. Contractor ↔ Firm collaboration links
-- Contractors can show which firms they've delivered projects for.
-- ============================================================
CREATE TABLE IF NOT EXISTS contractor_firms (
  contractor_id     UUID        REFERENCES contractors(id) ON DELETE CASCADE,
  company_id        UUID        REFERENCES companies(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (contractor_id, company_id)
);

-- ============================================================
-- 5. Homeowners table
-- Private B2C customers. Profile is NOT public — only visible to
-- parties they have an active/completed lead with.
-- ============================================================
CREATE TABLE IF NOT EXISTS homeowners (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  display_name  TEXT        NOT NULL,
  city_id       INTEGER     REFERENCES cities(id),
  phone         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. Firm subdivision — add structure + specialization columns
-- firm_structure: solo (individual engineer) vs. company
-- firm_specialization: optional deeper type chosen via "Level Up"
-- ============================================================
ALTER TABLE companies ADD COLUMN IF NOT EXISTS firm_structure TEXT
  CHECK (firm_structure IN ('solo', 'company'));

ALTER TABLE companies ADD COLUMN IF NOT EXISTS firm_specialization TEXT
  CHECK (firm_specialization IN (
    'architecture_interior',
    'structural_civil',
    'mep',
    'general_contractor',
    'multidisciplinary',
    'freelance_engineer',
    'sole_contractor'
  ));

-- ============================================================
-- 7. Ratings — add rater_type to distinguish homeowner vs B2B ratings
-- This creates two parallel rating tracks on every Maalem profile:
--   - 'professional' ratings: from firms, contractors (existing)
--   - 'homeowner' ratings: from homeowners (new, separately displayed)
-- ============================================================
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS rater_type TEXT
  CHECK (rater_type IN ('professional', 'homeowner'))
  DEFAULT 'professional';

-- ============================================================
-- 8. RLS Policies for new tables
-- ============================================================

ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_craftsmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE homeowners ENABLE ROW LEVEL SECURITY;

-- Contractors: public can read approved; owner can manage own; staff can do all
CREATE POLICY contractors_public_read ON contractors
  FOR SELECT USING (approval_status = 'approved');

CREATE POLICY contractors_owner_manage ON contractors
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY contractors_staff_all ON contractors
  FOR ALL USING (is_staff());

-- Contractor links: visible if either side is approved
CREATE POLICY contractor_craftsmen_read ON contractor_craftsmen
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM contractors c WHERE c.id = contractor_id AND c.approval_status = 'approved')
  );

CREATE POLICY contractor_firms_read ON contractor_firms
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM contractors c WHERE c.id = contractor_id AND c.approval_status = 'approved')
  );

-- Homeowners: PRIVATE — only visible to the owner themselves and staff
CREATE POLICY homeowners_owner_only ON homeowners
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY homeowners_staff_read ON homeowners
  FOR SELECT USING (is_staff());
