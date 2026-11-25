
def test_user_registration(client):
    response = client.post(
        "/auth/register",
        json={
            "email": "newuser@test.com",
            "password": "Test123456",
            "organization_name": "Test Organization"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["user"]["email"] == "newuser@test.com"
    assert data["organization"]["name"] == "Test Organization"
    assert data["user"]["organization_id"] == data["organization"]["id"]
    assert data["access_token"]


def test_user_login(client):
    # Register user first
    client.post(
        "/auth/register",
        json={
            "email": "login@test.com",
            "password": "Test123456",
            "organization_name": "Login Organization"
        }
    )

    # Login with registered credentials
    response = client.post(
        "/auth/login",
        json={
            "email": "login@test.com",
            "password": "Test123456"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["user"]["email"] == "login@test.com"
    assert data["access_token"]


def test_login_with_wrong_password(client):
    client.post(
        "/auth/register",
        json={
            "email": "wrong@test.com",
            "password": "Test123456",
            "organization_name": "Wrong Password Organization"
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "wrong@test.com",
            "password": "WrongPassword123"
        }
    )

    assert response.status_code == 401


def test_duplicate_email_registration(client):
    payload = {
        "email": "duplicate@test.com",
        "password": "Test123456",
        "organization_name": "Duplicate Organization"
    }

    first_response = client.post("/auth/register", json=payload)
    second_response = client.post("/auth/register", json=payload)

    assert first_response.status_code == 201
    assert second_response.status_code == 400
