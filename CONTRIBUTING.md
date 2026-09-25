# Contributing

## Workflow

1. Create a branch from `main`: `feat/<short-name>`, `fix/<short-name>` or `content/<short-name>`.
2. Keep pull requests small and focused. Link the issue they close.
3. CI must pass (lint, typecheck, tests, build) before merging.
4. At least one teammate reviews every PR. Changes to alert content or result wording also need sponsor review.

## Local checks

```bash
cd apps/web
npm run lint && npm run typecheck && npm test && npm run build
```

## Content rules (non-negotiable)

- **Never tell users a request is safe, legitimate or genuine.** Describe warning signs and verification steps instead. The wording test in `tests/scoring.test.ts` will fail if this rule is broken.
- **Alerts need two or more independent sources.** Two pages from the same publisher, or syndicated copies of one article, count as one source.
- **Cite, don't invent.** Every claim in an alert must be supported by one of its listed sources. Record the source's title, URL and publication date.
- **Plain language.** Aim for a reading age of about 12. Short sentences, no jargon.
- **No personal data.** Don't add analytics, tracking or anything that sends user answers off the device without an agreed design and privacy review.

## Commit messages

Use the imperative mood ("Add alert for toll scams"), and reference issues where relevant (`#12`).
