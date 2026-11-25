
def get_auth_headers(client):
    response = client.post(
        "/auth/register",
        json={
            "email": "dashboard@test.com",
            "password": "Test123456",
            "organization_name": "Dashboard Organization"
        }
    )

    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


def test_update_stock(client):
    headers = get_auth_headers(client)

    product_response = client.post(
        "/products/",
        headers=headers,
        json={
            "name": "Laptop",
            "sku": "LAP-001",
            "quantity_on_hand": 10,
            "low_stock_threshold": 5
        }
    )

    product_id = product_response.json()["id"]

    response = client.patch(
        f"/products/{product_id}/stock?quantity=3",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["quantity_on_hand"] == 3


def test_dashboard_summary(client):
    headers = get_auth_headers(client)

    client.post(
        "/products/",
        headers=headers,
        json={
            "name": "Laptop",
            "sku": "LAP-001",
            "quantity_on_hand": 3,
            "low_stock_threshold": 5
        }
    )

    client.post(
        "/products/",
        headers=headers,
        json={
            "name": "Mouse",
            "sku": "MOU-001",
            "quantity_on_hand": 20,
            "low_stock_threshold": 5
        }
    )

    response = client.get(
        "/dashboard/summary",
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_products"] == 2
    assert data["total_quantity"] == 23
    assert data["low_stock_count"] == 1
    assert data["low_stock_products"][0]["name"] == "Laptop"


def test_unauthorized_dashboard_access(client):
    response = client.get("/dashboard/summary")

    assert response.status_code == 401
