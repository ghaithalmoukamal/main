-- ============================================================
-- Migration 004: Maalem Pricing v2 + Service Areas
-- ============================================================

-- ============================================================
-- 1. Extend the services table with rich pricing fields
-- ============================================================
ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing_type TEXT
  CHECK (pricing_type IN (
    'fixed',           -- one flat price
    'per_hour',        -- charged by the hour
    'per_sqm',         -- charged per square meter (e.g. painter)
    'per_meter',       -- charged per linear meter (e.g. piping)
    'per_unit',        -- charged per piece/item (e.g. per socket, per door)
    'custom_formula'   -- Maalem uses custom pricing blocks below
  ))
  DEFAULT 'fixed';

-- Bilingual unit label (e.g. "للمتر المربع" / "per m²")
ALTER TABLE services ADD COLUMN IF NOT EXISTS price_unit_label_ar TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS price_unit_label_en TEXT;

-- Optional price range (shown as "from X to Y SYP")
ALTER TABLE services ADD COLUMN IF NOT EXISTS min_price NUMERIC;
ALTER TABLE services ADD COLUMN IF NOT EXISTS max_price NUMERIC;

-- Currency (defaults to SYP, can be USD for diaspora-facing Maalems)
-- Note: starting_price + currency already exist; these extend the model
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_currency TEXT DEFAULT 'SYP';

-- ============================================================
-- 2. Service pricing blocks
-- Each block is one pricing line the Maalem names themselves.
-- Example (Painter):
--   Block 1: "طلاء أساسي" / "Base coat" — 100 SYP/m²
--   Block 2: "نقشة / رسمة" / "Detail work" — 150 SYP/m²
-- The Maalem sets the header name, pricing type, and price.
-- ============================================================
CREATE TABLE IF NOT EXISTS service_pricing_blocks (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id      UUID        REFERENCES services(id) ON DELETE CASCADE,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  -- Maalem writes their own label for this pricing row
  block_header_ar TEXT        NOT NULL,
  block_header_en TEXT,
  pricing_type    TEXT        NOT NULL
                              CHECK (pricing_type IN (
                                'fixed',
                                'per_hour',
                                'per_sqm',
                                'per_meter',
                                'per_unit',
                                'per_item'
                              )),
  unit_price      NUMERIC     NOT NULL,
  currency        TEXT        DEFAULT 'SYP',
  -- Optional notes visible to client (e.g. "applies to rooms > 20m²")
  notes_ar        TEXT,
  notes_en        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pricing_blocks_service_idx
  ON service_pricing_blocks(service_id, sort_order);

ALTER TABLE service_pricing_blocks ENABLE ROW LEVEL SECURITY;

-- Public can read pricing blocks for any service
CREATE POLICY pricing_blocks_public_read ON service_pricing_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM services s
      JOIN craftsmen c ON c.id = s.craftsman_id
      WHERE s.id = service_id AND c.approval_status = 'approved'
    )
  );

-- Maalem can manage their own pricing blocks
CREATE POLICY pricing_blocks_owner_manage ON service_pricing_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM services s
      JOIN craftsmen c ON c.id = s.craftsman_id
      WHERE s.id = service_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY pricing_blocks_staff_all ON service_pricing_blocks
  FOR ALL USING (is_staff());

-- ============================================================
-- 3. Maalem service areas
-- The Maalem draws the geographic zone they naturally work within.
-- They can also specify what happens outside that zone:
-- not available / flat fee / per-km surcharge / percentage surcharge
-- ============================================================
CREATE TABLE IF NOT EXISTS craftsman_service_areas (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  craftsman_id          UUID        REFERENCES craftsmen(id) ON DELETE CASCADE UNIQUE,
  -- Option A: polygon (drawn on map)
  zone_polygon          JSONB,      -- GeoJSON Polygon coordinates array
  -- Option B: radius from a center point
  zone_radius_km        NUMERIC,
  zone_center_lat       DOUBLE PRECISION,
  zone_center_lng       DOUBLE PRECISION,
  -- Outside zone pricing
  outside_zone_type     TEXT
                        CHECK (outside_zone_type IN (
                          'not_available',   -- Maalem doesn't go outside zone
                          'flat_fee',        -- Fixed extra charge
                          'per_km',          -- Charge per km outside border
                          'percentage'       -- % surcharge on total job cost
                        )),
  outside_zone_amount   NUMERIC,    -- flat fee, per-km rate, or % (e.g. 10 = 10%)
  outside_zone_currency TEXT        DEFAULT 'SYP',
  notes_ar              TEXT,       -- e.g. "أعمل في كل أرجاء دمشق بدون رسوم إضافية"
  notes_en              TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE craftsman_service_areas ENABLE ROW LEVEL SECURITY;

-- Public can see service area of approved Maalems
CREATE POLICY service_areas_public_read ON craftsman_service_areas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM craftsmen c
      WHERE c.id = craftsman_id AND c.approval_status = 'approved'
    )
  );

-- Maalem can manage their own service area
CREATE POLICY service_areas_owner_manage ON craftsman_service_areas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM craftsmen c
      WHERE c.id = craftsman_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY service_areas_staff_all ON craftsman_service_areas
  FOR ALL USING (is_staff());
