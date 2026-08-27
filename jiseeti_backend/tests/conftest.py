import pytest
from app import create_app
from app.extensions import db


@pytest.fixture
def app():
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def signup(client, email="citizen@test.com", role="citizen"):
    res = client.post("/auth/signup", json={
        "full_name": "Test User",
        "email": email,
        "password": "pass123",
        "role": role,
    })
    return res.get_json()["token"]


@pytest.fixture
def citizen_token(client):
    return signup(client, "citizen@test.com", "citizen")


@pytest.fixture
def official_token(client):
    return signup(client, "official@test.com", "official")


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}