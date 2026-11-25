
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def create_product(
    db: Session,
    product_data: ProductCreate,
    organization_id: int
):
    # Check SKU uniqueness within the organization
    existing_product = db.query(Product).filter(
        Product.organization_id == organization_id,
        Product.sku == product_data.sku
    ).first()

    if existing_product:
        raise ValueError("SKU already exists in this organization")

    product = Product(
        **product_data.model_dump(),
        organization_id=organization_id
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def get_products(
    db: Session,
    organization_id: int,
    search: str | None = None
):
    query = db.query(Product).filter(
        Product.organization_id == organization_id
    )

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(term),
                Product.sku.ilike(term)
            )
        )

    return query.order_by(Product.id.desc()).all()


def get_product(
    db: Session,
    product_id: int,
    organization_id: int
):
    return db.query(Product).filter(
        Product.id == product_id,
        Product.organization_id == organization_id
    ).first()


def update_product(
    db: Session,
    product_id: int,
    organization_id: int,
    product_data: ProductUpdate
):
    product = get_product(db, product_id, organization_id)

    if not product:
        return None

    updates = product_data.model_dump(exclude_unset=True)

    # Check SKU uniqueness if SKU is being changed
    new_sku = updates.get("sku")

    if new_sku and new_sku != product.sku:
        existing_product = db.query(Product).filter(
            Product.organization_id == organization_id,
            Product.sku == new_sku,
            Product.id != product_id
        ).first()

        if existing_product:
            raise ValueError("SKU already exists in this organization")

    for key, value in updates.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product


def delete_product(
    db: Session,
    product_id: int,
    organization_id: int
):
    product = get_product(db, product_id, organization_id)

    if not product:
        return False

    db.delete(product)
    db.commit()

    return True


def update_stock(
    db: Session,
    product_id: int,
    organization_id: int,
    quantity: int
):
    product = get_product(db, product_id, organization_id)

    if not product:
        return None

    if quantity < 0:
        raise ValueError("Stock quantity cannot be negative")

    product.quantity_on_hand = quantity

    db.commit()
    db.refresh(product)

    return product
