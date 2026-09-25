# Source registry (draft)

These are candidate sources for alerts and the Phase 3 ingestion pipeline. **Every source needs sponsor
approval.** Before automated collection starts, check each source's terms of use and whether it has an
RSS feed or API.

The **ownership group** column drives the independence check: two sources in the same group count as
one source for the two-source rule.

| Source | Type | Region | Ownership group | Tier | Feed / access (to verify) |
|---|---|---|---|---|---|
| FTC Consumer Advice (consumer.ftc.gov) | Government | US | us-ftc | 1 | Consumer alerts: RSS |
| FBI IC3 Public Service Announcements (ic3.gov) | Government | US | us-doj-fbi | 1 | PSA listing page |
| CISA | Government | US | us-dhs-cisa | 1 | RSS |
| State Attorneys General | Government | US | per state | 1 | Varies |
| CFPB | Government | US | us-cfpb | 1 | Varies |
| AARP Fraud Watch Network | Nonprofit | US | aarp | 2 | Web |
| Better Business Bureau Scam Tracker | Nonprofit | US / CA | bbb | 2 | Web (user reports, so use as a signal, not as corroboration alone) |
| Ministry of Home Affairs / I4C (via PIB) | Government | IN | in-mha | 1 | PIB press releases |
| RBI consumer awareness | Regulator | IN | in-rbi | 1 | Web |
| Major national news outlets | News | Varies | by parent company | 2–3 | RSS |
| Bank / payment provider fraud pages | Financial institution | Varies | by institution | 2 | Web |
| Security vendor research blogs | Security vendor | Global | by vendor | 2–3 | RSS |

## Tiers

1. **Tier 1:** a government agency or regulator. Authoritative and primary.
2. **Tier 2:** an established nonprofit, financial institution, or major news outlet with original reporting.
3. **Tier 3:** a trade press outlet or vendor blog. Useful for early signals, but needs a Tier 1 or 2 source to corroborate it.

## Independence rules (Phase 5)

- Sources from the same ownership group count as one source.
- A news story that only repeats an agency advisory is **not** independent of that advisory.
- Near-duplicate text (syndication) counts as one source.

## Seed alerts: known limitation

The India "digital arrest" alert cites an MHA/PIB release and a Deccan Herald report about an I4C
advisory (I4C is part of MHA). These are separate publishers, but the news story reports on a government
advisory, so they are not fully independent. Before Phase 5, replace the news source with an independent
one (for example, RBI or a state police advisory).
