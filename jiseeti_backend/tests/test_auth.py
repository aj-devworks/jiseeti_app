def test_signup_success(client):
    res = client.post("/auth/signup", json={
        "full_name": "Jane Doe", "email": "jane@test.com",
        "password": "pass123", "role": "citizen",
    })
    assert res.status_code == 201
    assert "token" in res.get_json()


def test_signup_duplicate_email(client):
    client.post("/auth/signup", json={
        "full_name": "Jane", "email": "dupe@test.com",
        "password": "pass123", "role": "citizen",
    })
    res = client.post("/auth/signup", json={
        "full_name": "Jane 2", "email": "dupe@test.com",
        "password": "pass123", "role": "citizen",
    })
    assert res.status_code == 409


def test_login_wrong_password(client):
    client.post("/auth/signup", json={
        "full_name": "Jane", "email": "jane2@test.com",
        "password": "pass123", "role": "citizen",
    })
    res = client.post("/auth/login", json={
        "email": "jane2@test.com", "password": "wrong",
    })
    assert res.status_code == 401


def test_login_success(client):
    client.post("/auth/signup", json={
        "full_name": "Jane", "email": "jane3@test.com",
        "password": "pass123", "role": "citizen",
    })
    res = client.post("/auth/login", json={
        "email": "jane3@test.com", "password": "pass123",
    })
    assert res.status_code == 200
    assert "token" in res.get_json()