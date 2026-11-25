
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.product import Product


DEFAULT_LOW_STOCK_THRESHOLD = 5


def get_dashboard_summary(
    db: Session,
    organization_id: int
):
    # Total number of products
    total_products = db.query(func.count(Product.id)).filter(
        Product.organization_id == organization_id
    ).scalar() or 0

    # Total stock quantity
    total_quantity = db.query(
        func.coalesce(func.sum(Product.quantity_on_hand), 0)
    ).filter(
        Product.organization_id == organization_id
    ).scalar() or 0

    # Products with low stock
    low_stock_products = db.query(Product).filter(
        Product.organization_id == organization_id,
        Product.quantity_on_hand <= func.coalesce(
            Product.low_stock_threshold,
            DEFAULT_LOW_STOCK_THRESHOLD
        )
    ).order_by(Product.quantity_on_hand.asc()).all()

    return {
        "total_products": total_products,
        "total_quantity": total_quantity,
        "low_stock_count": len(low_stock_products),
        "low_stock_products": low_stock_products
    }
