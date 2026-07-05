import asyncio
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.user import User
from app.core.password import get_password_hash

async def fix_password():
    async with SessionLocal() as db:
        # Find the user
        result = await db.execute(
            select(User).where(User.email == 'robiyamuzaffarova03@gmail.com')
        )
        user = result.scalar_one_or_none()
        
        if not user:
            print("❌ User not found!")
            return
        
        # Hash the correct password
        password = 'Sonic1303'
        hashed = get_password_hash(password)
        
        print(f"Updating password for {user.email}")
        print(f"New hash: {hashed}")
        
        # Update the password
        user.hashed_password = hashed
        user.is_active = True
        user.is_verified = True
        
        await db.commit()
        
        print("\n" + "="*70)
        print("✅ PASSWORD FIXED SUCCESSFULLY!")
        print("="*70)
        print(f"\nLogin credentials:")
        print(f"  Email:    robiyamuzaffarova03@gmail.com")
        print(f"  Password: Sonic1303")
        print(f"\nTry logging in at: http://localhost:8000/docs/login\n")

if __name__ == "__main__":
    asyncio.run(fix_password())
