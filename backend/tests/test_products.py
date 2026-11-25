
def get_auth_headers(
    client,
    email="product@test.com",
    organization_name="Product Test Organization"
):
    response = client.post(
        "/auth/register",
        json={
            "email": email,
            "password": "Test123456",
            "organization_name": organization_name
        }
    )

    assert response.status_code == 201

    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


def test_create_product(client):
    headers = get_auth_headers(client)

    response = client.post(
        "/products/",
        headers=headers,
        json={
            "name": "Laptop",
            "sku": "LAP-001",
            "description": "Test laptop",
            "quantity_on_hand": 10,
            "cost_price": 45000,
            "selling_price": 55000,
            "low_stock_threshold": 5
        }
    )

    assert response.status_code == 201
    assert response.json()["name"] == "Laptop"
    assert response.json()["sku"] == "LAP-001"


def test_get_products(client):
    headers = get_auth_headers(client)

    client.post(
        "/products/",
        headers=headers,
        json={
            "name": "Mouse",
            "sku": "MOU-001",
            "quantity_on_hand": 20
        }
    )

    response = client.get("/products/", headers=headers)

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Mouse"


def test_duplicate_sku(client):
    headers = get_auth_headers(client)

    payload = {
        "name": "Laptop",
        "sku": "LAP-001",
        "quantity_on_hand": 10
    }

    first = client.post(
        "/products/",
        headers=headers,
        json=payload
    )

    second = client.post(
        "/products/",
        headers=headers,
        json=payload
    )

    assert first.status_code == 201
    assert second.status_code == 409


def test_search_products(client):
    headers = get_auth_headers(client)

    client.post(
        "/products/",
        headers=headers,
        json={
            "name": "Keyboard",
            "sku": "KEY-001",
            "quantity_on_hand": 15
        }
    )

    response = client.get(
        "/products/?search=Keyboard",
        headers=headers
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["sku"] == "KEY-001"


def test_organization_data_isolation(client):
    # Register Company A
    headers_a = get_auth_headers(
        client,
        email="company_a@test.com",
        organization_name="Company A"
    )

    # Register Company B
    headers_b = get_auth_headers(
        client,
        email="company_b@test.com",
        organization_name="Company B"
    )

    # Create product for Company A
    create_response = client.post(
        "/products/",
        headers=headers_a,
        json={
            "name": "Company A Laptop",
            "sku": "LAP-001",
            "quantity_on_hand": 10
        }
    )

    assert create_response.status_code == 201

    # Company B must not see Company A's product
    response = client.get(
        "/products/",
        headers=headers_b
    )

    assert response.status_code == 200
    assert response.json() == []
