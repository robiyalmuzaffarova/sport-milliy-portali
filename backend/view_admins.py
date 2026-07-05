import asyncio
from sqlalchemy import select, or_
from app.db.session import SessionLocal
from app.models.user import User, UserRole

async def view_admins():
    async with SessionLocal() as db:
        # Query all admin and superuser accounts
        result = await db.execute(
            select(User).where(
                or_(User.role == UserRole.ADMIN, User.is_superuser == True)
            ).order_by(User.id)
        )
        users = result.scalars().all()
        
        print("\n" + "="*70)
        print("EXISTING ADMIN/SUPERUSER ACCOUNTS")
        print("="*70)
        
        if not users:
            print("❌ No admin or superuser accounts found!\n")
            return
        
        for i, user in enumerate(users, 1):
            status = "✅ Active" if user.is_active else "❌ Inactive"
            print(f"\n[Account {i}]")
            print(f"  ID:    {user.id}")
            print(f"  Email: {user.email}")
            print(f"  Name:  {user.full_name}")
            print(f"  Role:  {user.role.upper()}")
            print(f"  Status: {status}")
        
        print("\n" + "="*70 + "\n")

if __name__ == "__main__":
    asyncio.run(view_admins())
