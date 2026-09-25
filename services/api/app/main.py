"""Scam Aware API: Phase 2 skeleton.

Serves the Phase 1 static content so the web app can move to an API without
changing its data shape. Replace the JSON loading with database queries in Phase 2.
"""

import json
from pathlib import Path
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException

DATA_DIR = Path(__file__).resolve().parents[3] / "apps/web/src/data"

app = FastAPI(title="Scam Aware API", version="0.1.0")


def _load(name: str):
    return json.loads((DATA_DIR / name).read_text())


def _publisher_count(alert: dict) -> int:
    hosts = {urlparse(s["url"]).hostname.removeprefix("www.") for s in alert["sources"]}
    names = {s["name"].strip().lower() for s in alert["sources"]}
    return min(len(hosts), len(names))


def _publishable(alert: dict) -> bool:
    """Two-source rule. Mirrors apps/web/src/lib/alerts.ts."""
    return (
        alert["status"] == "approved"
        and alert["confidence"] == "corroborated"
        and _publisher_count(alert) >= 2
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/alerts")
def list_alerts():
    return [a for a in _load("alerts.json") if _publishable(a)]


@app.get("/alerts/{alert_id}")
def get_alert(alert_id: str):
    for a in _load("alerts.json"):
        if a["id"] == alert_id and _publishable(a):
            return a
    raise HTTPException(status_code=404, detail="Alert not found")


@app.get("/checklist")
def checklist():
    return _load("checklist.json")


@app.get("/resources")
def resources(region: str | None = None):
    groups = _load("resources.json")
    if region:
        groups = [g for g in groups if g["region"] in (region.upper(), "OTHER")]
    return groups
