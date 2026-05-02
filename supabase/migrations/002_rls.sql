-- ============================================================
-- Row Level Security
-- ============================================================

-- Helper: is current auth.uid() an admin/moderator?
CREATE OR REPLACE FUNCTION is_staff() RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin','moderator','worker')
      AND is_active
  );
$$;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active
  );
$$;

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_self_read ON profiles
  FOR SELECT USING (auth.uid() = id OR is_staff());
CREATE POLICY profiles_self_update ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_admin_all ON profiles
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- cities, trades, asset_types — public read
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY cities_public_read ON cities FOR SELECT USING (TRUE);
CREATE POLICY cities_admin_write ON cities
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY trades_public_read ON trades
  FOR SELECT USING (is_approved OR is_staff());
CREATE POLICY trades_staff_write ON trades
  FOR ALL USING (is_staff()) WITH CHECK (is_staff());

ALTER TABLE asset_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY asset_types_public_read ON asset_types FOR SELECT USING (TRUE);
CREATE POLICY asset_types_staff_write ON asset_types
  FOR ALL USING (is_staff()) WITH CHECK (is_staff());

-- craftsmen — only approved are publicly visible
ALTER TABLE craftsmen ENABLE ROW LEVEL SECURITY;
CREATE POLICY craftsmen_approved_read ON craftsmen
  FOR SELECT USING (
    approval_status = 'approved' OR auth.uid() = user_id OR is_staff()
  );
CREATE POLICY craftsmen_self_write ON craftsmen
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY craftsmen_self_update ON craftsmen
  FOR UPDATE USING (auth.uid() = user_id OR is_staff());
CREATE POLICY craftsmen_staff_delete ON craftsmen
  FOR DELETE USING (is_admin());

-- services, workshop_assets, work_journal_posts — owner + public read on approved
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY services_read ON services FOR SELECT USING (TRUE);
CREATE POLICY services_owner_write ON services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
    OR is_staff()
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
    OR is_staff()
  );

ALTER TABLE workshop_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY assets_read ON workshop_assets FOR SELECT USING (TRUE);
CREATE POLICY assets_owner_write ON workshop_assets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
    OR is_staff()
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
    OR is_staff()
  );

ALTER TABLE work_journal_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY journal_read ON work_journal_posts FOR SELECT USING (TRUE);
CREATE POLICY journal_owner_write ON work_journal_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
  );

-- companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY companies_approved_read ON companies
  FOR SELECT USING (
    approval_status = 'approved' OR auth.uid() = user_id OR is_staff()
  );
CREATE POLICY companies_self_write ON companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY companies_self_update ON companies
  FOR UPDATE USING (auth.uid() = user_id OR is_staff());

-- map_zones
ALTER TABLE map_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY zones_visibility_read ON map_zones FOR SELECT USING (
  visibility = 'public'
  OR (visibility = 'firms_only' AND auth.uid() IS NOT NULL)
  OR is_staff()
);
CREATE POLICY zones_staff_write ON map_zones
  FOR ALL USING (is_staff()) WITH CHECK (is_staff());

-- leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY leads_party_read ON leads FOR SELECT USING (
  client_user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
  OR is_staff()
);
CREATE POLICY leads_client_insert ON leads FOR INSERT WITH CHECK (client_user_id = auth.uid());
CREATE POLICY leads_party_update ON leads FOR UPDATE USING (
  client_user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
  OR is_staff()
);

-- job_evidence, ratings, disputes
ALTER TABLE job_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY evidence_party_access ON job_evidence FOR ALL USING (
  EXISTS (SELECT 1 FROM leads l WHERE l.id = lead_id AND (
    l.client_user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = l.craftsman_id AND c.user_id = auth.uid())
    OR is_staff()
  ))
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
-- Public ratings: visible to firms (logged in users) and staff. Private: parties + staff.
CREATE POLICY ratings_read ON ratings FOR SELECT USING (
  is_public OR rated_by = auth.uid() OR is_staff()
  OR EXISTS (SELECT 1 FROM leads l WHERE l.id = lead_id AND (
    l.client_user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = l.craftsman_id AND c.user_id = auth.uid())
  ))
);
CREATE POLICY ratings_insert ON ratings FOR INSERT WITH CHECK (rated_by = auth.uid());

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY disputes_access ON disputes FOR ALL USING (
  raised_by = auth.uid() OR is_staff()
);

-- subscription_plans, subscriptions
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY plans_public_read ON subscription_plans FOR SELECT USING (is_active OR is_staff());
CREATE POLICY plans_admin_write ON subscription_plans FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subs_self_read ON subscriptions FOR SELECT USING (user_id = auth.uid() OR is_staff());
CREATE POLICY subs_admin_write ON subscriptions FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- channels, channel_subscriptions, channel_posts
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY channels_read ON channels FOR SELECT USING (is_active OR is_staff());
CREATE POLICY channels_staff_write ON channels FOR ALL USING (is_staff()) WITH CHECK (is_staff());

ALTER TABLE channel_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY chan_sub_self ON channel_subscriptions FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE channel_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY channel_posts_read ON channel_posts FOR SELECT USING (
  approval_status = 'approved' OR is_staff()
  OR EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.user_id = auth.uid())
);
CREATE POLICY channel_posts_supplier_insert ON channel_posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.user_id = auth.uid())
);

-- ads — only admins can hard-delete; workers approve/edit
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY ads_read ON ads FOR SELECT USING (
  (approval_status = 'approved' AND is_active)
  OR is_staff()
  OR EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.user_id = auth.uid())
);
CREATE POLICY ads_supplier_insert ON ads FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.user_id = auth.uid())
);
CREATE POLICY ads_owner_or_staff_update ON ads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.user_id = auth.uid())
  OR is_staff()
);
-- Workers cannot DELETE ads — only admins.
CREATE POLICY ads_admin_delete ON ads FOR DELETE USING (is_admin());

-- material_requests
ALTER TABLE material_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY mat_read ON material_requests FOR SELECT USING (TRUE);
CREATE POLICY mat_owner_write ON material_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM craftsmen c WHERE c.id = craftsman_id AND c.user_id = auth.uid())
);

-- reports, fraud_flags, behavior_indicators, audit_log
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY reports_self_insert ON reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY reports_staff_read ON reports FOR SELECT USING (is_staff() OR reporter_id = auth.uid());

ALTER TABLE fraud_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY fraud_staff_only ON fraud_flags FOR ALL USING (is_staff()) WITH CHECK (is_staff());

ALTER TABLE behavior_indicators ENABLE ROW LEVEL SECURITY;
CREATE POLICY indicators_staff_only ON behavior_indicators FOR ALL USING (is_staff()) WITH CHECK (is_staff());

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_staff_read ON audit_log FOR SELECT USING (is_staff());
CREATE POLICY audit_no_manual_insert ON audit_log FOR INSERT WITH CHECK (FALSE);

-- notifications
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY np_self ON notification_preferences FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notif_self ON notifications FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE craftsman_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY rec_read ON craftsman_recommendations FOR SELECT USING (mutually_confirmed OR is_staff() OR
  EXISTS (SELECT 1 FROM craftsmen c WHERE c.id IN (from_craftsman_id, to_craftsman_id) AND c.user_id = auth.uid())
);
CREATE POLICY rec_party_write ON craftsman_recommendations FOR ALL USING (
  EXISTS (SELECT 1 FROM craftsmen c WHERE c.id IN (from_craftsman_id, to_craftsman_id) AND c.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM craftsmen c WHERE c.id IN (from_craftsman_id, to_craftsman_id) AND c.user_id = auth.uid())
);

ALTER TABLE project_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY teams_owner ON project_teams FOR ALL USING (
  EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.user_id = auth.uid())
  OR is_staff()
) WITH CHECK (
  EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.user_id = auth.uid())
);
