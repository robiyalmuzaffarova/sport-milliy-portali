#!/usr/bin/env python3
"""
Reset admin/superuser password script
"""
import asyncio
import sys
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

from app.models.user import User
from app.core.password import hash_password
from app.core.config import settings


async def main():
    # Create async engine
    engine = create_async_engine(
        str(settings.DATABASE_URL),
        echo=False,
    )
    
    # Create session factory
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_delete=False
    )
    
    async with async_session() as session:
        # Query all admin and superuser accounts
        result = await session.execute(
            select(User).where(
                (User.role == "admin") | (User.role == "superuser")
            ).order_by(User.id)
        )
        users = result.scalars().all()
        
        if not users:
            print("❌ No admin or superuser accounts found!")
            print("\nCreating a new superuser...")
            
            # Create new superuser
            email = input("Enter email for new superuser: ").strip()
            password = input("Enter password: ").strip()
            full_name = input("Enter full name (optional): ").strip() or "Admin User"
            
            new_user = User(
                email=email,
                full_name=full_name,
                password_hash=hash_password(password),
                role="superuser",
                is_active=True,
                is_verified=True
            )
            session.add(new_user)
            await session.commit()
            print(f"✅ Superuser created: {email}")
            return
        
        print("=" * 60)
        print("EXISTING ADMIN/SUPERUSER ACCOUNTS")
        print("=" * 60)
        for user in users:
            status = "✅ Active" if user.is_active else "❌ Inactive"
            print(f"ID: {user.id}")
            print(f"Email: {user.email}")
            print(f"Name: {user.full_name}")
            print(f"Role: {user.role.upper()}")
            print(f"Status: {status}")
            print("-" * 60)
        
        # Reset password
        print("\n" + "=" * 60)
        print("RESET PASSWORD")
        print("=" * 60)
        
        user_id = input(f"\nEnter User ID to reset password (1-{users[-1].id}): ").strip()
        try:
            user_id = int(user_id)
            user = next((u for u in users if u.id == user_id), None)
            if not user:
                print(f"❌ User with ID {user_id} not found!")
                return
        except ValueError:
            print("❌ Invalid ID!")
            return
        
        new_password = input("Enter new password: ").strip()
        if not new_password:
            print("❌ Password cannot be empty!")
            return
        
        # Update password
        user.password_hash = hash_password(new_password)
        await session.commit()
        
        print(f"\n✅ Password reset successfully for {user.email}")
        print(f"New login credentials:")
        print(f"  Email: {user.email}")
        print(f"  Password: {new_password}")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nCancelled.")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
