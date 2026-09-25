"""Validate apps/web/src/data/alerts.json against schemas/alert.schema.json.

Usage: python scripts/validate_alerts.py   (requires: pip install jsonschema)
"""

import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parent.parent
schema = json.loads((ROOT / "schemas/alert.schema.json").read_text())
alerts = json.loads((ROOT / "apps/web/src/data/alerts.json").read_text())

validator = Draft202012Validator(schema)
errors = 0
ids = set()
for alert in alerts:
    aid = alert.get("id", "<no id>")
    if aid in ids:
        print(f"[{aid}] duplicate id")
        errors += 1
    ids.add(aid)
    for err in validator.iter_errors(alert):
        path = "/".join(str(p) for p in err.absolute_path) or "(root)"
        print(f"[{aid}] {path}: {err.message}")
        errors += 1

if errors:
    print(f"\n{errors} problem(s) found")
    sys.exit(1)
print(f"OK: {len(alerts)} alerts valid")
