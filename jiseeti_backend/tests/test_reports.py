from tests.conftest import auth_header


def create_sample_report(client, token):
    return client.post("/reports", json={
        "category": "red-flag", "title": "Pothole",
        "description": "Big hole", "location": "Main St",
    }, headers=auth_header(token))


def test_create_report_requires_auth(client):
    res = client.post("/reports", json={
        "category": "red-flag", "title": "X", "description": "Y",
    })
    assert res.status_code == 401


def test_create_report_success(client, citizen_token):
    res = create_sample_report(client, citizen_token)
    assert res.status_code == 201
    assert res.get_json()["status"] == "pending"


def test_list_reports_public(client, citizen_token):
    create_sample_report(client, citizen_token)
    res = client.get("/reports")
    assert res.status_code == 200
    assert len(res.get_json()) == 1


def test_filter_reports_by_status(client, citizen_token):
    create_sample_report(client, citizen_token)
    res = client.get("/reports?status=resolved")
    assert res.get_json() == []


def test_edit_own_report(client, citizen_token):
    report_id = create_sample_report(client, citizen_token).get_json()["id"]
    res = client.patch(f"/reports/{report_id}", json={"title": "Updated"},
                        headers=auth_header(citizen_token))
    assert res.status_code == 200
    assert res.get_json()["title"] == "Updated"


def test_edit_others_report_forbidden(client, citizen_token, official_token):
    report_id = create_sample_report(client, citizen_token).get_json()["id"]
    res = client.patch(f"/reports/{report_id}", json={"title": "Hacked"},
                        headers=auth_header(official_token))
    assert res.status_code == 403


def test_upvote_toggle(client, citizen_token):
    report_id = create_sample_report(client, citizen_token).get_json()["id"]
    res1 = client.post(f"/reports/{report_id}/upvote", headers=auth_header(citizen_token))
    assert res1.status_code == 201
    res2 = client.post(f"/reports/{report_id}/upvote", headers=auth_header(citizen_token))
    assert res2.status_code == 200
    assert "removed" in res2.get_json()["message"].lower()


def test_delete_own_report(client, citizen_token):
    report_id = create_sample_report(client, citizen_token).get_json()["id"]
    res = client.delete(f"/reports/{report_id}", headers=auth_header(citizen_token))
    assert res.status_code == 200
    assert client.get(f"/reports/{report_id}").status_code == 404