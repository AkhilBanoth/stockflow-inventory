
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token


def signup_user(db: Session, email: str, password: str, organization_name: str):
    # Check whether email already exists
    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise ValueError("Email is already registered")

    # Create organization
    organization = Organization(
        name=organization_name
    )

    db.add(organization)
    db.flush()

    # Create user
    user = User(
        email=email,
        hashed_password=hash_password(password),
        organization_id=organization.id
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    db.refresh(organization)

    return user, organization


def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user or not verify_password(
        password,
        user.hashed_password
    ):
        return None

    token = create_access_token({
        "sub": str(user.id)
    })

    return user, token
