
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    AuthResponse,
    UserResponse
)
from app.schemas.organization import OrganizationResponse
from app.services.auth_service import signup_user, login_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    data: SignupRequest,
    db: Session = Depends(get_db)
):
    try:
        user, organization = signup_user(
            db=db,
            email=data.email,
            password=data.password,
            organization_name=data.organization_name
        )

        from app.core.security import create_access_token

        token = create_access_token({
            "sub": str(user.id)
        })

        return AuthResponse(
            access_token=token,
            user=UserResponse.model_validate(user),
            organization=OrganizationResponse.model_validate(organization)
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.post("/login", response_model=AuthResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    result = login_user(
        db=db,
        email=data.email,
        password=data.password
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user, token = result

    return AuthResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
        organization=OrganizationResponse.model_validate(
            user.organization
        )
    )


@router.get("/me", response_model=UserResponse)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user

