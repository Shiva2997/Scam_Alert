# Scam Aware — Phased Development Roadmap

**Project:** Scam Aware — an evidence-grounded AI decision-support app for digital safety
**Sponsor:** AI Communications Consulting (Pause.Prove.Protect.™ framework)
**Timeline assumption:** ~16-week capstone semester, Phase 1 delivered on Day 1

---

## Guiding principles (apply to every phase)

1. **Decision support, not authority.** The app never tells a user a request is "safe." Outputs are framed as risk signals plus verification steps.
2. **Two-source rule.** No material threat is shown as a current alert unless corroborated by at least two independent, credible sources.
3. **Grounded or silent.** Every AI-generated statement links to a source; when evidence is thin, the system says so or abstains.
4. **Human in the loop.** Nothing AI-generated is published without sponsor review.
5. **Privacy by default.** Collect nothing you don't need; keep user history on-device; no accounts required for core features.

---

## Architecture at a glance (target end state)

```
 Trusted sources (FTC, FBI IC3, CISA, BBB, AARP, state AGs, banks, news)
            │
            ▼
 [Ingestion]  → raw_documents (Postgres)
            │
            ▼
 [NLP pipeline]  normalize → embed → cluster → classify (taxonomy) → extract warning signs
            │
            ▼
 [Corroboration]  independence check → ≥2 credible sources → candidate alert
            │
            ▼
 [Grounded summarizer]  cited summary + audience variants + uncertainty flags
            │
            ▼
 [Human review console]  approve / revise / reject / retire  (audit log)
            │
            ▼
 [Public API]  →  [Mobile app / PWA]  Assessment • Alerts • Checklist • Report links
```

**Stack (recommended):**
- **Frontend:** React + TypeScript + Vite + Tailwind, built as a PWA → wrapped with Capacitor for App Store / Google Play in Phase 7
- **Backend:** Python FastAPI (Python is the natural home for the NLP work)
- **Data:** PostgreSQL + pgvector (embeddings and similarity search in one database)
- **AI:** LLM API for extraction/summarization with structured (JSON-schema) output; sentence-embedding model for clustering
- **Jobs:** scheduled workers (APScheduler or Celery) for ingestion
- **CI/CD:** GitHub Actions; frontend on GitHub Pages or Vercel, backend on Render/Fly.io/Railway

---

## Phase 1 — Foundation & Static MVP (Day 1) ✅ GitHub-ready

**Goal:** A public repo with a working, deployed, mobile-friendly app that delivers the core Pause.Prove.Protect.™ experience **with no AI and no backend** — rule-based and fully offline-capable. This proves the UX and sets up the structure every later phase plugs into.

### Scope

| Feature | Day-1 implementation |
|---|---|
| Guided assessment | 8–12 yes/no questions (urgency, secrecy, unusual payment method, impersonation, unsolicited contact, request to bypass normal process, etc.). Rule-based scoring → **Low signals / Some warning signs / Strong warning signs**. Never outputs "safe." |
| Result screen | Which red flags were detected and why they matter, plus **Pause → Prove → Protect** next steps tailored to the flags |
| Checklist | Static Pause.Prove.Protect.™ checklist page, works offline |
| Current alerts (seed) | 3–5 hand-written alerts from a `alerts.json` file, each with **≥2 source links**, following the alert schema below |
| Report & get help | Links to official reporting: reportfraud.ftc.gov, ic3.gov, identitytheft.gov (US); cybercrime.gov.in / 1930 helpline (India); placeholder for other regions |
| Disclaimer | Visible "decision support, not a guarantee" notice on every result |
| Privacy | No accounts, no analytics, no data leaves the device |

### Data contracts defined on Day 1 (so later phases don't need rework)

`schemas/alert.schema.json` — draft taxonomy v0:
```json
{
  "id": "string",
  "title": "string",
  "status": "draft | approved | retired",
  "scam_type": "impersonation | investment | romance | tech_support | ...",
  "channels": ["sms", "email", "phone", "social", "voice_clone", "..."],
  "impersonated_entity": "string | null",
  "manipulation_techniques": ["urgency", "authority", "fear", "secrecy", "..."],
  "requested_action": "pay | share_credentials | install_app | click_link | ...",
  "payment_methods": ["gift_card", "crypto", "wire", "p2p_app", "..."],
  "target_population": ["older_adults", "students", "small_business", "..."],
  "geography": ["US", "IN", "..."],
  "warning_signs": ["string"],
  "verification_steps": ["string"],
  "sources": [{ "name": "string", "url": "string", "published": "date" }],
  "confidence": "corroborated | emerging | insufficient",
  "last_reviewed": "date"
}
```

### Repo structure

```
scam-aware/
├── README.md              # what it is, principles, screenshots, how to run
├── ROADMAP.md             # this file
├── LICENSE                # confirm with sponsor (Pause.Prove.Protect.™ is a trademark)
├── CONTRIBUTING.md
├── .github/
│   ├── workflows/ci.yml   # lint + test + build on every PR
│   └── ISSUE_TEMPLATE/
├── apps/
│   └── web/               # React + TS + Vite + Tailwind PWA
│       ├── src/
│       │   ├── pages/     # Home, Assess, Result, Checklist, Alerts, Report
│       │   ├── lib/scoring.ts      # rule-based assessment logic
│       │   ├── data/questions.json
│       │   └── data/alerts.json
│       └── tests/scoring.test.ts
├── services/
│   └── api/               # empty FastAPI skeleton + README (Phase 2)
├── schemas/
│   └── alert.schema.json
└── docs/
    ├── taxonomy.md
    ├── source-registry.md # candidate trusted sources + credibility notes
    └── responsible-ai.md  # principles above, expanded
```

### Day-1 schedule (~8–10 hours)

| Time | Task |
|---|---|
| Hour 1 | Create repo, scaffold Vite + React + TS + Tailwind, add CI workflow, README skeleton |
| Hour 2 | Write `questions.json`, `alert.schema.json`, `docs/taxonomy.md` |
| Hours 3–4 | Build assessment flow + `scoring.ts` + unit tests |
| Hour 5 | Result screen with flag explanations and Pause/Prove/Protect actions |
| Hour 6 | Checklist, Report & Help, and Alerts pages (alerts rendered from JSON with sources) |
| Hour 7 | Mobile polish, accessibility pass (keyboard, contrast, font scaling), PWA manifest + offline caching |
| Hour 8 | Deploy to GitHub Pages/Vercel, screenshots in README, tag `v0.1.0` |
| Buffer | Write GitHub issues for Phases 2–3 so the team can pick up work immediately |

### Definition of done
- [ ] Repo is public with README, license, CI passing (green badge)
- [ ] Live demo URL linked in README
- [ ] Assessment works on a phone, never displays "safe"
- [ ] Every seed alert shows ≥2 source links
- [ ] Scoring logic has unit tests
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Checklist loads offline after first visit

---

## Phase 2 — Backend, Data Model & Source Registry (Weeks 1–2)

**Goal:** Move from static JSON to a real API and database.

- FastAPI service with endpoints: `GET /alerts`, `GET /alerts/{id}`, `GET /checklist`, `GET /resources?region=`
- PostgreSQL schema: `sources`, `raw_documents`, `clusters`, `alerts`, `alert_sources`, `reviews`, `audit_log`
- **Source registry:** each approved source gets a record — type (government / nonprofit / security vendor / financial institution / news), credibility tier, region, feed URL, terms of use, and **ownership group** (needed later for independence checks)
- Frontend switches from `alerts.json` to the API, with the JSON kept as an offline fallback
- Docker Compose for local dev; backend deployed to a free tier host
- **Sponsor checkpoint:** approve the initial source list and taxonomy v1

**Done when:** alerts are served from the database, source registry has 15–25 vetted sources, API has tests.

---

## Phase 3 — Threat-Intelligence Ingestion (Weeks 3–4)

**Goal:** Automatically collect reports from approved sources.

- Connectors for RSS/Atom feeds and public APIs first; respectful scraping only where terms allow
- Scheduled jobs (e.g., every 6 hours), with retry, rate limiting, and per-source health status
- Normalization: extract clean text, title, date, URL, source; language detection
- **Exact and near-duplicate detection** (URL canonicalization + text hashing / MinHash) so syndicated copies of the same article don't count as separate reports
- Store raw documents immutably for traceability

**Done when:** pipeline runs unattended for a week, ingests from ≥10 sources, and a dashboard shows documents per source and failures.

---

## Phase 4 — AI Classification & Clustering (Weeks 5–7)

**Goal:** Turn raw documents into structured, grouped scam intelligence.

- **Relevance filter:** is this document about a consumer scam at all?
- **Embeddings + clustering** (pgvector similarity, HDBSCAN or threshold-based) to group reports describing the same or closely related scam
- **Novelty detection:** new cluster vs. update to an existing cluster vs. routine coverage
- **LLM structured extraction** into the taxonomy (scam type, channel, impersonated entity, manipulation techniques, payment method, geography, target, requested action, harm) using JSON-schema output, with extracted fields linked to supporting text spans
- **Warning-sign extraction:** the behavioral cues most useful to a person at the decision point
- **Evaluation set:** team hand-labels 150–300 documents; measure per-field precision/recall and clustering quality; track in `eval/` with reproducible scripts

**Done when:** classification F1 targets agreed with sponsor are met on the held-out set, and every extracted field is traceable to source text.

---

## Phase 5 — Corroboration & Grounded Summarization (Weeks 7–9)

**Goal:** Only surface threats that are genuinely corroborated, explained accurately.

- **Independence check:** two sources count as independent only if they differ in ownership group and one isn't simply republishing the other (uses Phase 2 registry + Phase 3 near-duplicate detection)
- **Corroboration rule engine:** cluster → `corroborated` (≥2 independent credible sources), `emerging` (1 credible source, internal only), or `insufficient`
- **Grounded summarizer:** produces What's happening / Who's targeted / How it works / Warning signs / How to verify / Where to report — every sentence cites a source; facts vs. inference visibly separated
- **Faithfulness check:** automated verification that each claim is supported by a cited passage; unsupported claims are dropped or flagged
- **Abstention:** if sources conflict or are thin, the summary says so rather than guessing
- **Audience adaptation:** plain-language, older-adult, and small-business variants generated from the same fact set, with a check that facts don't change between variants

**Done when:** faithfulness rate on a review sample meets the agreed threshold and zero alerts reach review without two independent sources.

---

## Phase 6 — Human Review Workflow (Weeks 9–11)

**Goal:** Give the sponsor full editorial control before anything is published.

- Authenticated admin console (sponsor/reviewers only)
- Review queue showing the candidate alert, its cluster, all sources side by side, extracted fields, and faithfulness flags
- Actions: **approve, revise (inline edit), reject (with reason), retire** (expired threats)
- Full audit log of who changed what and when; versioned alerts
- Reviewer feedback captured as labeled data to improve Phases 4–5
- Optional notifications to reviewers when high-severity candidates arrive

**Done when:** sponsor can run the full ingest → review → publish loop on their own.

---

## Phase 7 — Mobile App & Privacy-Conscious Features (Weeks 11–13)

**Goal:** A cross-platform app ready for store submission.

- Wrap the PWA with Capacitor (or port to Expo/React Native if native features demand it) for iOS and Android builds
- **Offline:** checklist, assessment, and last-synced alerts available without a connection
- **Optional on-device history** of past assessments (encrypted local storage, easy delete)
- **Trusted-person sharing:** share an assessment summary with a family member or colleague via the OS share sheet — nothing routed through our servers
- Opt-in push notifications for high-severity, approved alerts, filterable by region/audience
- Localization framework (English first; structure ready for more languages)
- Privacy policy, data inventory, and store privacy labels drafted with the sponsor

**Done when:** TestFlight and Google Play internal-testing builds are installed by the team and sponsor.

---

## Phase 8 — Evaluation, Safety Testing & Launch Readiness (Weeks 14–16)

**Goal:** Demonstrate the system is accurate, safe, and usable.

- **Usability testing** with 8–12 people across target audiences (including older adults); iterate on confusing flows
- **Red-teaming:** attempts to get the app to declare something "safe," prompt injection via ingested articles, fake-source poisoning, misleading summaries
- **Accessibility audit** against WCAG 2.2 AA
- **Security review:** dependency scanning, secrets management, admin auth, API rate limiting
- Final metrics report: classification accuracy, corroboration precision, faithfulness, abstention rate, time-from-first-report-to-alert, usability scores
- Handover: deployment docs, runbook, cost estimate for hosting and AI usage, recommendations for next steps
- Store submission package (screenshots, descriptions, privacy labels) prepared for the sponsor

**Done when:** final demo delivered, handover docs complete, sponsor signs off.

---

## Milestone summary

| Phase | When | Key deliverable |
|---|---|---|
| 1 | Day 1 | Deployed static MVP on GitHub (assessment, checklist, seed alerts, reporting links) |
| 2 | Weeks 1–2 | API + database + vetted source registry |
| 3 | Weeks 3–4 | Automated ingestion with de-duplication |
| 4 | Weeks 5–7 | Classification, clustering, evaluation set |
| 5 | Weeks 7–9 | Corroboration engine + cited summaries |
| 6 | Weeks 9–11 | Sponsor review console |
| 7 | Weeks 11–13 | iOS/Android test builds with privacy features |
| 8 | Weeks 14–16 | Evaluation report, red-team results, handover |

## Key risks & mitigations

| Risk | Mitigation |
|---|---|
| AI hallucinates or overstates a threat | Grounded generation, faithfulness checks, abstention, mandatory human review |
| Syndicated news counted as "two sources" | Ownership-group registry + near-duplicate detection |
| Users read the app as a "safe/unsafe" oracle | Wording rules enforced in code and tests; no "safe" output path exists |
| Source terms of use restrict scraping | Prefer RSS/APIs; record terms in the source registry; sponsor approval per source |
| LLM costs grow with volume | Filter and cluster before calling the LLM; cache; summarize per cluster, not per document |
| Trademark/IP questions | Confirm licensing of Pause.Prove.Protect.™ and repo license with sponsor before making the repo public |
