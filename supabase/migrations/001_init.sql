-- ============================================================
-- سوق الحرفيين — Initial Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ------------------------------------------------------------
-- Identity
-- ------------------------------------------------------------

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('admin','moderator','worker','supplier','craftsman','user')),
  permissions JSONB NOT NULL DEFAULT '{}'::JSONB,
  behavior_score INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_phone ON profiles(phone);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'SY',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before JSONB,
  after JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_log(actor_id);

-- ------------------------------------------------------------
-- Trades & Assets
-- ------------------------------------------------------------

CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  submitted_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE asset_types (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  trade_id INTEGER REFERENCES trades(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Craftsmen
-- ------------------------------------------------------------

CREATE TABLE craftsmen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  city_id INTEGER NOT NULL REFERENCES cities(id),
  name TEXT NOT NULL,
  trade_id INTEGER REFERENCES trades(id) ON DELETE SET NULL,
  custom_trade_name TEXT,
  bio_ar TEXT,
  bio_en TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook TEXT,
  photo_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_name TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','busy')),
  approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending','approved','rejected')),
  approved_by UUID REFERENCES profiles(id),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_elite BOOLEAN NOT NULL DEFAULT FALSE,
  mode_pref TEXT CHECK (mode_pref IN ('lite','normal')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_craftsmen_trade ON craftsmen(trade_id);
CREATE INDEX idx_craftsmen_city ON craftsmen(city_id);
CREATE INDEX idx_craftsmen_status ON craftsmen(status);
CREATE INDEX idx_craftsmen_approval ON craftsmen(approval_status);
CREATE INDEX idx_craftsmen_loc ON craftsmen(latitude, longitude);
CREATE INDEX idx_craftsmen_name_ar_trgm ON craftsmen USING gin (name gin_trgm_ops);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  craftsman_id UUID NOT NULL REFERENCES craftsmen(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  starting_price NUMERIC,
  currency TEXT NOT NULL DEFAULT 'SYP',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_services_craftsman ON services(craftsman_id);

CREATE TABLE workshop_assets (
  id SERIAL PRIMARY KEY,
  craftsman_id UUID NOT NULL REFERENCES craftsmen(id) ON DELETE CASCADE,
  asset_type_id INTEGER REFERENCES asset_types(id) ON DELETE SET NULL,
  custom_name TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_assets_craftsman ON workshop_assets(craftsman_id);
CREATE INDEX idx_assets_type ON workshop_assets(asset_type_id);

CREATE TABLE work_journal_posts (
  id SERIAL PRIMARY KEY,
  craftsman_id UUID NOT NULL REFERENCES craftsmen(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE craftsman_recommendations (
  id SERIAL PRIMARY KEY,
  from_craftsman_id UUID NOT NULL REFERENCES craftsmen(id) ON DELETE CASCADE,
  to_craftsman_id UUID NOT NULL REFERENCES craftsmen(id) ON DELETE CASCADE,
  context TEXT,
  mutually_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (from_craftsman_id, to_craftsman_id)
);

-- ------------------------------------------------------------
-- Companies
-- ------------------------------------------------------------

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  city_id INTEGER NOT NULL REFERENCES cities(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (
    type IN ('engineering_firm','contractor','interior_design','supplier','other')
  ),
  description TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook TEXT,
  website TEXT,
  logo_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_name TEXT,
  approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending','approved','rejected')),
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_companies_approval ON companies(approval_status);
CREATE INDEX idx_companies_type ON companies(type);

CREATE TABLE project_teams (
  id SERIAL PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  craftsman_ids UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Map zones
-- ------------------------------------------------------------

CREATE TABLE map_zones (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  type TEXT NOT NULL CHECK (
    type IN ('construction','market','industrial','heritage','residential','commercial')
  ),
  description TEXT,
  geojson JSONB NOT NULL,
  color TEXT NOT NULL DEFAULT '#C67B30',
  visibility TEXT NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public','firms_only','admin_only')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_zones_city ON map_zones(city_id);
CREATE INDEX idx_zones_active ON map_zones(is_active);

-- ------------------------------------------------------------
-- Leads, jobs, ratings, disputes
-- ------------------------------------------------------------

CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  craftsman_id UUID NOT NULL REFERENCES craftsmen(id) ON DELETE CASCADE,
  client_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  client_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  contact_method TEXT NOT NULL DEFAULT 'in_app'
    CHECK (contact_method IN ('whatsapp','in_app')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending','approved','declined','waiting','in_progress',
    'completed_by_craftsman','completed','disputed','expired'
  )),
  waiting_until TIMESTAMPTZ,
  extension_used BOOLEAN NOT NULL DEFAULT FALSE,
  craftsman_notes TEXT,
  client_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_leads_craftsman ON leads(craftsman_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_client ON leads(client_user_id);

CREATE TABLE job_evidence (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES profiles(id),
  role TEXT NOT NULL CHECK (role IN ('craftsman','client')),
  type TEXT NOT NULL CHECK (type IN ('progress','completion')),
  photos TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_evidence_lead ON job_evidence(lead_id);

CREATE TABLE ratings (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  rated_by UUID NOT NULL REFERENCES profiles(id),
  rated_entity_type TEXT NOT NULL CHECK (rated_entity_type IN ('craftsman','client')),
  rated_entity_id UUID NOT NULL,
  quality SMALLINT CHECK (quality BETWEEN 1 AND 5),
  punctuality SMALLINT CHECK (punctuality BETWEEN 1 AND 5),
  communication SMALLINT CHECK (communication BETWEEN 1 AND 5),
  price_fairness SMALLINT CHECK (price_fairness BETWEEN 1 AND 5),
  comment TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ratings_entity ON ratings(rated_entity_type, rated_entity_id);

CREATE TABLE disputes (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  raised_by UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','in_mediation','resolved','closed')),
  escalation_level SMALLINT NOT NULL DEFAULT 1
    CHECK (escalation_level BETWEEN 1 AND 3),
  admin_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Subscriptions, payments, ads, channels
-- ------------------------------------------------------------

CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  target_audience TEXT NOT NULL CHECK (target_audience IN ('firm','supplier')),
  duration_type TEXT NOT NULL CHECK (duration_type IN ('one_time','monthly','yearly')),
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  features JSONB NOT NULL DEFAULT '[]'::JSONB,
  max_contacts_per_month INTEGER,
  max_ads INTEGER,
  can_target_zones BOOLEAN NOT NULL DEFAULT FALSE,
  can_target_categories BOOLEAN NOT NULL DEFAULT FALSE,
  priority_placement BOOLEAN NOT NULL DEFAULT FALSE,
  analytics_access BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','expired','cancelled')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  stripe_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_subs_user ON subscriptions(user_id);
CREATE INDEX idx_subs_status ON subscriptions(status);

CREATE TABLE channels (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('trade','material','zone','custom')),
  related_trade_id INTEGER REFERENCES trades(id) ON DELETE SET NULL,
  related_zone_id INTEGER REFERENCES map_zones(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'auto'
    CHECK (source IN ('auto','admin','suggested')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE channel_subscriptions (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, channel_id)
);

CREATE TABLE channel_posts (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  price_info TEXT,
  whatsapp TEXT,
  approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending','approved','rejected')),
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_channel_posts_channel ON channel_posts(channel_id);
CREATE INDEX idx_channel_posts_approval ON channel_posts(approval_status);

CREATE TABLE ads (
  id SERIAL PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  format TEXT NOT NULL DEFAULT 'image_card'
    CHECK (format IN ('image_card','sponsored_search','banner','channel_post')),
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  whatsapp TEXT,
  target_trade_ids INTEGER[] NOT NULL DEFAULT '{}',
  target_zone_ids INTEGER[] NOT NULL DEFAULT '{}',
  ad_type TEXT NOT NULL DEFAULT 'one_time'
    CHECK (ad_type IN ('one_time','subscription')),
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
  approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending','approved','rejected')),
  approved_by UUID REFERENCES profiles(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  impressions BIGINT NOT NULL DEFAULT 0,
  clicks BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ads_approval ON ads(approval_status);
CREATE INDEX idx_ads_active ON ads(is_active);
CREATE INDEX idx_ads_target_trades ON ads USING gin(target_trade_ids);
CREATE INDEX idx_ads_target_zones ON ads USING gin(target_zone_ids);

CREATE TABLE material_requests (
  id SERIAL PRIMARY KEY,
  craftsman_id UUID NOT NULL REFERENCES craftsmen(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  target_channel_ids INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- ------------------------------------------------------------
-- Reports, fraud, scoring
-- ------------------------------------------------------------

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_entity_type TEXT NOT NULL,
  target_entity_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','reviewed','actioned','dismissed')),
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reports_target ON reports(target_entity_type, target_entity_id);
CREATE INDEX idx_reports_status ON reports(status);

CREATE TABLE fraud_flags (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  signal TEXT NOT NULL CHECK (
    signal IN ('duplicate_phone','ghost_profile','accept_cancel','rating_anomaly')
  ),
  severity TEXT NOT NULL DEFAULT 'low'
    CHECK (severity IN ('low','medium','high')),
  raw_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','reviewed','dismissed')),
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_fraud_status ON fraud_flags(status);
CREATE INDEX idx_fraud_entity ON fraud_flags(entity_type, entity_id);

CREATE TABLE behavior_indicators (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  indicator_key TEXT NOT NULL,
  value NUMERIC NOT NULL,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (entity_type, entity_id, indicator_key)
);
CREATE INDEX idx_indicators_entity ON behavior_indicators(entity_type, entity_id);

-- ------------------------------------------------------------
-- Notifications
-- ------------------------------------------------------------

CREATE TABLE notification_preferences (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('webpush','whatsapp','sms','inapp')),
  event_type TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (user_id, channel, event_type)
);

CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
