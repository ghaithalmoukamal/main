-- ============================================================
-- Seed Data
-- ============================================================

-- Cities
INSERT INTO cities (name_ar, name_en, country) VALUES
  ('دمشق', 'Damascus', 'SY'),
  ('ريف دمشق', 'Rif Dimashq', 'SY')
ON CONFLICT DO NOTHING;

-- Trades
INSERT INTO trades (name_ar, name_en, icon, is_approved) VALUES
  ('نجار', 'Carpenter', 'hammer', TRUE),
  ('حداد', 'Blacksmith', 'anvil', TRUE),
  ('كهربائي', 'Electrician', 'zap', TRUE),
  ('سباك', 'Plumber', 'wrench', TRUE),
  ('دهان', 'Painter', 'paintbrush', TRUE),
  ('بلّاط', 'Tiler', 'grid', TRUE),
  ('لحّام', 'Welder', 'flame', TRUE),
  ('ألمنيوم', 'Aluminum Worker', 'layers', TRUE),
  ('حجّار', 'Stonemason', 'mountain', TRUE),
  ('ميكانيكي', 'Mechanic', 'settings', TRUE),
  ('خراط', 'Turner', 'disc', TRUE),
  ('زجاج', 'Glassworker', 'square', TRUE)
ON CONFLICT DO NOTHING;

-- Asset types
INSERT INTO asset_types (name_ar, name_en, trade_id) VALUES
  ('منشار كهربائي', 'Electric Saw', (SELECT id FROM trades WHERE name_en='Carpenter')),
  ('مخرطة خشب', 'Wood Lathe', (SELECT id FROM trades WHERE name_en='Carpenter')),
  ('آلة لحام بلازما', 'Plasma Welder', (SELECT id FROM trades WHERE name_en='Welder')),
  ('آلة لحام أرغون', 'Argon Welder', (SELECT id FROM trades WHERE name_en='Welder')),
  ('مولدة كهرباء', 'Power Generator', NULL),
  ('كومبريسر هواء', 'Air Compressor', NULL),
  ('مكبس هيدروليك', 'Hydraulic Press', (SELECT id FROM trades WHERE name_en='Blacksmith')),
  ('ثاقبة عمودية', 'Drill Press', (SELECT id FROM trades WHERE name_en='Blacksmith')),
  ('آلة بلاط', 'Tile Cutter', (SELECT id FROM trades WHERE name_en='Tiler')),
  ('ضاغط هواء كبير', 'Industrial Compressor', NULL)
ON CONFLICT DO NOTHING;

-- Subscription plans
INSERT INTO subscription_plans
  (name_ar, name_en, target_audience, duration_type, price, currency, features,
   max_contacts_per_month, max_ads, can_target_zones, can_target_categories,
   priority_placement, analytics_access)
VALUES
  ('أساسي', 'Basic', 'firm', 'monthly', 0, 'USD',
   '["browse_profiles","basic_search"]'::jsonb, 5, NULL, FALSE, FALSE, FALSE, FALSE),
  ('احترافي', 'Professional', 'firm', 'monthly', 30, 'USD',
   '["browse_profiles","advanced_search","save_teams","capacity_filter","reliability_scores"]'::jsonb,
   NULL, NULL, FALSE, TRUE, FALSE, TRUE),
  ('احترافي سنوي', 'Professional Yearly', 'firm', 'yearly', 250, 'USD',
   '["browse_profiles","advanced_search","save_teams","capacity_filter","reliability_scores","zone_targeting","priority_support"]'::jsonb,
   NULL, NULL, TRUE, TRUE, TRUE, TRUE),
  ('إعلان واحد', 'Single Ad', 'supplier', 'one_time', 10, 'USD',
   '["single_ad","basic_targeting"]'::jsonb, NULL, 1, FALSE, TRUE, FALSE, FALSE),
  ('باقة شهرية', 'Monthly Package', 'supplier', 'monthly', 40, 'USD',
   '["unlimited_ads","zone_targeting","category_targeting","basic_analytics"]'::jsonb,
   NULL, 5, TRUE, TRUE, FALSE, TRUE),
  ('باقة سنوية', 'Yearly Package', 'supplier', 'yearly', 350, 'USD',
   '["unlimited_ads","zone_targeting","category_targeting","full_analytics","priority_placement","featured_badge"]'::jsonb,
   NULL, NULL, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Default channels (auto-generated from trades)
INSERT INTO channels (name_ar, name_en, slug, type, related_trade_id, source) VALUES
  ('أدوات النجارة', 'Carpentry Tools', 'carpentry-tools', 'trade',
   (SELECT id FROM trades WHERE name_en='Carpenter'), 'auto'),
  ('مواد لحام', 'Welding Supplies', 'welding-supplies', 'trade',
   (SELECT id FROM trades WHERE name_en='Welder'), 'auto'),
  ('كهرباء وإضاءة', 'Electrical Supplies', 'electrical', 'trade',
   (SELECT id FROM trades WHERE name_en='Electrician'), 'auto'),
  ('سباكة وأنابيب', 'Plumbing Supplies', 'plumbing', 'trade',
   (SELECT id FROM trades WHERE name_en='Plumber'), 'auto'),
  ('دهانات', 'Paint Supplies', 'paint', 'trade',
   (SELECT id FROM trades WHERE name_en='Painter'), 'auto'),
  ('سيراميك ورخام', 'Tile and Marble', 'tile-marble', 'trade',
   (SELECT id FROM trades WHERE name_en='Tiler'), 'auto'),
  ('إعمار دمشق', 'Damascus Construction', 'damascus-construction', 'custom', NULL, 'admin')
ON CONFLICT (slug) DO NOTHING;
