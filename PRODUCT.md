# سوق الحرفيين — Product Brain

> **Tagline:** من إيد المعلم... لعندك دغري  
> *"From the master's hand... straight to yours"*

---

## Vision

A geographic marketplace that connects three worlds of the Syrian construction and craft economy:

- **المعلم (The Maalem)** — the master craftsman with a trade, tools, and a reputation built over years
- **الشركات والمقاولون (Firms & Contractors)** — engineering firms and project managers who need reliable skilled hands
- **صاحب البيت (The Homeowner)** — the private customer who needs the right person for the right job

We are building **trust infrastructure** for a market that runs on word of mouth. The platform makes reputation visible, pricing transparent, and discovery geographic.

---

## User Roles & Their Jobs-to-Be-Done

| Role | Arabic | Who They Are | Core Job-to-Be-Done |
|------|--------|--------------|---------------------|
| `craftsman` | المعلم | Master craftsman with a trade and workshop | Get found by the right clients, show pricing & work area, manage leads |
| `contractor` | المقاول | Project-level professional — individual or small company | Be discoverable for full projects, recruit Maalems for work, manage their reputation |
| `firm` | الشركة الهندسية | Engineering firm — solo engineer or company | Find the right Maalem for each project, build a trusted team roster |
| `supplier` | المورّد | Material supplier or manufacturer | Reach Maalems and firms through targeted ads and channels |
| `homeowner` | صاحب البيت | Private B2C customer needing work done at home/property | Find a trusted Maalem quickly, read real reviews, book with confidence |
| `admin` | مدير | Platform administrator | Approve accounts, moderate content, detect fraud, manage zones |
| `moderator` | مشرف | Staff moderator | Approve craftsmen, companies, ads, trades, channel posts |
| `worker` | عامل المراجعة | Admin-level review worker (NOT a craftsman — this role is internal staff only) | Granular approvals within trade/zone limits |

> ⚠️ **Critical naming rule:** `worker` in the codebase is an **internal admin/moderation role**. The master craftsman is always called **Maalem (معلم)** in UI copy and stored as role `craftsman` in the DB. Never mix these up.

---

## Platform Segments

```
B2C segment:  Homeowner ←→ Maalem / Contractor
B2B segment:  Firm ←→ Maalem / Contractor / Supplier
Supply side:  Supplier → Maalem (via channels & material ads)
```

The homeowner segment is our **growth engine and brand builder**. When everyday people find and hire Maalems easily, the brand spreads by word of mouth in the B2C market — which then attracts more Maalems and firms.

---

## Feature Areas

### ✅ Completed (MVP)

- [x] **Maalem profile** — name, trade, bio (AR/EN), location, photo, social links
- [x] **Maalem registration wizard** — 3-step (personal info → services → workshop assets)
- [x] **Status toggle** — Open / Busy
- [x] **Lead lifecycle** — pending → approved → in_progress → completed → disputed
- [x] **Work journal** — photo posts for portfolio
- [x] **Workshop assets** — tools inventory with verification status
- [x] **Search & filter** — by trade, city, zone, status, assets
- [x] **Map view** — craftsmen pins + zone polygons on Damascus map
- [x] **Nearest Maalem** — geolocation-based distance search
- [x] **Supplier registration & dashboard** — ads, channel posts, material requests
- [x] **Firm portal** — search, project teams, analytics, billing
- [x] **Admin panel** — full moderation suite (approvals, fraud detection, disputes, audit log, zones, talent)
- [x] **Subscription billing** — Stripe integration for firm and supplier plans
- [x] **WhatsApp OTP + SMS fallback** — login authentication
- [x] **Bilingual (AR/EN)** — full i18n with RTL support
- [x] **Lite mode** — low-bandwidth UI toggle
- [x] **Zone management** — admin draws GeoJSON zones on map
- [x] **Channels** — trade and zone-based material supply channels
- [x] **RLS policies** — Supabase row-level security for all entities

### 🚧 In Progress (Current Sprint — Phase 1)

- [~] **PRODUCT.md** — this file, living product documentation
- [~] **Contractor role** — new searchable B2B professional (individual or company)
  - Registration wizard (personal info → specializations → past projects)
  - Public profile (bio, linked Maalems, linked firms, portfolio)
  - Dashboard (leads, posted jobs, Maalem roster)
  - Searchable alongside Maalems
  - Subscription plan
- [~] **Homeowner role** — B2C private customer
  - Simple registration (name + phone + city)
  - Private profile (only visible to parties they interact with)
  - Separate homeowner rating dimension on Maalem profiles
- [~] **Landing page redesign** — B2C vs B2B split
  - First-visit context screen (I need work done / I'm a professional)
  - Homeowner path: map-first search hero
  - B2B path: professional type selector (Maalem / Contractor / Firm / Supplier)
  - Stored in cookie, never shown again

### 📋 Planned (Phase 2)

- [ ] **Maalem pricing v2** — rich customizable pricing blocks per service
  - Pricing types: fixed / per hour / per m² / per meter / per unit
  - Custom block headers (Maalem names each row)
  - Price range (min–max)
  - Displayed beautifully on public profile
- [ ] **Maalem service areas** — draw working zone on the map
  - Polygon or radius-based zone drawing
  - Outside-zone surcharge (flat fee / per km / percentage)
  - Shown on public profile with shaded map
  - "Works in my area" geo-filter in search
- [ ] **Firm subdivision + progressive specialization**
  - Solo vs. Company choice at registration
  - "Level Up" to specify firm type (Architecture / MEP / Structural / General Contractor)
  - Dashboard adapts: search defaults, team templates, recommended channels

### 🔭 Planned (Phase 3)

- [ ] **Contractor ↔ Maalem linking** — public profile shows Maalems and firms worked with
- [ ] **Contractor subscription plan** — dedicated tier for contractors
- [ ] **Homeowner rating display** — aggregate on all profiles (public), full text gated to approved professionals
- [ ] **Firm-type-adaptive search defaults** — Architecture firms see finishers first, MEP firms see electricians/plumbers first
- [ ] **AI-assisted lead matching** — recommend Maalems based on job description
- [ ] **Push notifications** — lead alerts, status updates via web push
- [ ] **Ratings display v2** — visible aggregate ratings on Maalem profiles
- [ ] **Calendar availability** — Maalem sets available dates, homeowners see real-time slot
- [ ] **Contractor job posting** — contractors post jobs and Maalems apply

---

## Architectural Decisions (ADRs)

### ADR-001: Supabase over Firebase
**Decision:** Use Supabase (PostgreSQL) as the primary backend.  
**Why:** The data model is highly relational (leads ↔ craftsmen ↔ companies ↔ zones ↔ ratings). Supabase gives us row-level security, PostgreSQL's GeoJSON support, and real-time subscriptions — none of which Firebase handles as cleanly for relational data. Syrian construction data is structured, not document-based.

### ADR-002: Bilingual First (AR + EN)
**Decision:** All content (UI, profiles, services, channels) supports Arabic and English from day one.  
**Why:** The primary market is Arabic-speaking Syria/diaspora, but contractors and firms often need English-facing profiles to work with international clients and NGOs active in reconstruction. RTL/LTR switching is a first-class concern.

### ADR-003: WhatsApp OTP as Primary Auth
**Decision:** WhatsApp OTP is the primary login method, SMS via Twilio is the fallback.  
**Why:** In Syria and the broader Arab market, WhatsApp penetration is ~95%+. Email-based auth has very low trust. Phone-number identity maps 1:1 with real-world professional identity — a Maalem's phone IS their business card.

### ADR-004: Demo Auth (localStorage) → Supabase Auth (Production)
**Decision:** The current system uses a `demo-auth.ts` localStorage-based system for rapid UI development.  
**Why:** Allows full UI development and testing without Supabase credentials. The production switch is a drop-in: replace `useAuth()` context calls with Supabase session hooks. All RLS policies are already written and ready in `002_rls.sql`.

### ADR-005: B2C / B2B Split as Core UX Paradigm
**Decision:** The landing page separates homeowners (B2C) and professionals (B2B) from the first second.  
**Why:** Homeowner (صاحب البيت) needs are radically different from a firm's needs. A homeowner wants to search, browse, and contact quickly — map-first. A professional needs to understand their role-specific features, subscribe, and onboard. Mixing these on one landing page creates a confusing experience for both.

### ADR-006: `worker` is an Internal Role — Never a Craftsman
**Decision:** The role `worker` in the DB and code refers ONLY to admin moderation staff.  
**Why:** The term "worker" was established before the Maalem terminology was finalized. All UI copy must use "Maalem (معلم)" for the craftsman. This ADR exists to prevent naming confusion in future development.

### ADR-007: Homeowner Ratings — Public Aggregate, Gated Individual Reviews
**Decision:** Aggregate homeowner score (e.g., "4.7 ★ from homeowners") is public on all profiles. Individual review text is only visible to approved professionals.  
**Why (KPI logic):** Public score → social proof → more homeowners register → network effect. Gating individual text to approved accounts → nudges unapproved Maalems toward verification → improves platform quality. No paywall on reviews → less friction than Checkatrade model → higher review volume. Benchmarked against Houzz Pro, Bark.com, Checkatrade, TaskRabbit.

---

## Roadmap Milestones

```
Phase 0 (Done)      → MVP: Maalem + Firm + Supplier + Admin
Phase 1 (Now)       → Contractor role + Homeowner role + Landing page redesign
Phase 2 (Next)      → Pricing v2 + Service areas + Firm subdivision
Phase 3 (Future)    → Contractor subscriptions + Rating display + Availability calendar
Phase 4 (Scale)     → AI matching + Push notifications + Mobile app
```

---

## Open Questions & Research Items

- [ ] **Contractor subscription pricing** — $25/mo recommended. Validate with early contractor users.
- [ ] **Homeowner verification** — Should homeowners verify phone via WhatsApp OTP same as professionals? Or allow anonymous browsing with optional registration?
- [ ] **Dispute resolution SLA** — What is the target resolution time for Level 1/2/3 disputes?
- [ ] **Zone expansion** — Damascus is the launch city. What's the sequencing for Aleppo, Homs, Latakia?
- [ ] **Contractor vs. Firm overlap** — A large contractor company could also behave like a firm. Should there be a role upgrade path?
- [ ] **Supplier access to homeowner data** — Should suppliers ever see homeowner profiles or contact info? Current answer: No.

---

## Key Numbers (Launch Targets)

| Metric | Target |
|--------|--------|
| Maalems approved at launch | 50 |
| Trades covered | 12 (core) |
| Cities at launch | 1 (Damascus) |
| Homeowner reviews needed for social proof | 100 |
| Firms onboarded pre-launch | 10 |

---

*This file is committed to git and should be updated at the end of every sprint. It is the single source of truth for product thinking.*
