# Responsible design principles

Mistakes in this app can cost people money or their safety. These principles apply to every phase, and
where possible they are enforced in code and tests, not just in documentation.

## 1. Decision support, not authority

- The app never says that a request, message, person or website is safe, legitimate or genuine.
- The lowest assessment result is **"Few warning signs found"**. It always says this is not a guarantee and still asks the user to verify.
- *Enforced by:* `tests/scoring.test.ts → responsible wording` and `tests/Result.test.tsx`.

## 2. Uncertainty makes the result more cautious

- "Not sure" and unanswered questions count as partial warning signs.
- An uncertain answer on a critical question gives at least "Some warning signs".
- In AI phases, the system **abstains** ("we don't have enough reliable information") when evidence is thin or sources conflict.

## 3. Two-source rule

- A material threat is shown as a current alert only if **two or more independent, credible sources** support it.
- Pages from the same publisher, syndicated copies, and news stories that only repeat one advisory each count as one source.
- *Enforced by:* `src/lib/alerts.ts → isPublishable()` (Phase 1 checks publisher hostname and name). Phase 5 extends this with ownership groups and near-duplicate detection.

## 4. Grounded or silent

- Every statement in an alert must trace back to a cited source.
- AI-generated summaries (Phase 5) show confirmed facts separately from inference, and each claim goes through a faithfulness check.
- When audience-specific versions are written (older adults, small businesses), the facts must not change.

## 5. Human in the loop

- No AI-generated content is published without sponsor approval (Phase 6 review console).
- Each alert has a `last_reviewed` date. Stale alerts get re-reviewed or retired.

## 6. Privacy by default

- No accounts, analytics, cookies or third-party scripts in Phase 1.
- Assessment answers stay in memory on the device and are gone when the tab closes.
- Later features (history, trusted-person sharing) must be opt-in, on-device, and easy to delete.

## 7. Accessible and kind

- Plain language, large tap targets, keyboard and screen-reader support, dark mode, and reduced-motion support.
- The app never blames victims. The help page says clearly that being scammed is not the person's fault.

## Red-team checklist (run each phase)

- [ ] Can any combination of answers produce wording that implies a request is safe?
- [ ] Can a single source, or two copies of one source, produce a public alert?
- [ ] Can text inside an ingested article change system behaviour (prompt injection)? *(Phase 4 onwards)*
- [ ] Does any user data leave the device without explicit, informed consent?
