from tests.conftest import auth_header


def create_sample_report(client, token):
    return client.post("/reports", json={
        "category": "red-flag", "title": "Pothole",
        "description": "Big hole", "location": "Main St",
    }, headers=auth_header(token))


def test_status_change_requires_official(client, citizen_token):
    report_id = create_sample_report(client, citizen_token).get_json()["id"]
    res = client.patch(f"/admin/reports/{report_id}/status",
                        json={"status": "resolved"},
                        headers=auth_header(citizen_token))
    assert res.status_code == 403


def test_status_change_success(client, citizen_token, official_token):
    report_id = create_sample_report(client, citizen_token).get_json()["id"]
    res = client.patch(f"/admin/reports/{report_id}/status",
                        json={"status": "in-progress"},
                        headers=auth_header(official_token))
    assert res.status_code == 200
    assert res.get_json()["status"] == "in-progress"


def test_admin_stats(client, citizen_token, official_token):
    create_sample_report(client, citizen_token)
    res = client.get("/admin/stats", headers=auth_header(official_token))
    assert res.status_code == 200
    assert res.get_json()["pending"] == 1


def test_create_alert_requires_official(client, citizen_token):
    res = client.post("/alerts", json={"title": "X", "message": "Y"},
                       headers=auth_header(citizen_token))
    assert res.status_code == 403


def test_create_and_list_alert(client, official_token):
    res = client.post("/alerts", json={"title": "Water shutdown", "message": "Friday 8am"},
                       headers=auth_header(official_token))
    assert res.status_code == 201

    res2 = client.get("/alerts")
    assert res2.status_code == 200
    assert len(res2.get_json()) == 1