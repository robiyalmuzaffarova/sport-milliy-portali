import asyncio
from sqlalchemy import select
from app.db.session import SessionLocal  # Adjust this import to your session factory
from app.models.user import User, UserRole
from app.core.password import get_password_hash
from app.core.config import settings


async def create_first_superuser():
    async with SessionLocal() as db:
        # Check if user already exists
        result = await db.execute(
            select(User).where(User.email == settings.FIRST_SUPERUSER_EMAIL)
        )
        user = result.scalar_one_or_none()

        if not user:
            new_user = User(
                email=settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name=settings.FIRST_SUPERUSER_FULLNAME,
                role=UserRole.ADMIN,
                is_superuser=True,
                is_active=True,
                is_verified=True
            )
            db.add(new_user)
            await db.commit()
            print(f"Superuser {settings.FIRST_SUPERUSER_EMAIL} created successfully.")
        else:
            print("Superuser already exists.")


if __name__ == "__main__":
    asyncio.run(create_first_superuser())