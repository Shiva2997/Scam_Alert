# Scam Aware API (Phase 2 skeleton)

This is a FastAPI service. It will serve alerts, the checklist and reporting resources from PostgreSQL,
and later host the ingestion and AI pipeline. For now it serves the same static JSON as the web app,
so the frontend can switch to it without changing its data shape.

```bash
cd services/api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload     # http://localhost:8000/docs
pytest
```

## Planned (Phase 2)

- `GET /alerts`, `GET /alerts/{id}`, `GET /checklist`, `GET /resources?region=`
- PostgreSQL + pgvector: `sources`, `raw_documents`, `clusters`, `alerts`, `alert_sources`, `reviews`, `audit_log`
- Source registry with ownership groups (see `docs/source-registry.md`)
- Docker Compose for local development
