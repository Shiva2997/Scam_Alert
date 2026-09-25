from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_alerts_all_have_two_sources():
    alerts = client.get("/alerts").json()
    assert len(alerts) >= 3
    for a in alerts:
        assert len(a["sources"]) >= 2


def test_unknown_alert_404():
    assert client.get("/alerts/does-not-exist").status_code == 404


def test_resources_region_filter():
    regions = {g["region"] for g in client.get("/resources?region=in").json()}
    assert regions == {"IN", "OTHER"}
