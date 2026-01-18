"""
Enhanced Permission System with Role-Based Access Control (RBAC)
Sport Milliy Portali - Backend

FIXED VERSION:
- Superuser: Full CRUD on ALL resources
- Admin: Full CRUD on News, Merches, Education, JobVacancy; READ ONLY on others
- Users (Athlete, Trainer, Observer): Limited permissions based on role
"""
from enum import Enum
from typing import List, Optional, Dict, Set
from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User, UserRole
from app.db.session import get_db


class Permission(str, Enum):
    """Available permissions"""
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    EXPORT = "export"
    BULK_DELETE = "bulk_delete"


class Resource(str, Enum):
    """Protected resources in the system"""
    USERS = "users"
    NEWS = "news"
    MERCHES = "merches"
    EDUCATION = "education"
    JOB_VACANCIES = "job_vacancies"
    AI_CHATS = "ai_chats"
    CART = "cart"
    FAVORITES = "favorites"
    TRANSACTIONS = "transactions"


# Permission matrix for each role
# NOTE: Superuser permissions are handled separately in has_permission() function
ROLE_PERMISSIONS: Dict[UserRole, Dict[Resource, Set[Permission]]] = {
    UserRole.ADMIN: {
        # Admin has FULL CRUD on these 4 resources
        Resource.NEWS: {Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE,
                       Permission.EXPORT, Permission.BULK_DELETE},
        Resource.MERCHES: {Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE,
                          Permission.EXPORT, Permission.BULK_DELETE},
        Resource.EDUCATION: {Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE,
                            Permission.EXPORT, Permission.BULK_DELETE},
        Resource.JOB_VACANCIES: {Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE,
                                Permission.EXPORT, Permission.BULK_DELETE},

        # Admin has READ ONLY on all other resources
        Resource.USERS: {Permission.READ},
        Resource.AI_CHATS: {Permission.READ},
        Resource.CART: {Permission.READ},
        Resource.FAVORITES: {Permission.READ},
        Resource.TRANSACTIONS: {Permission.READ},
    },
    UserRole.ATHLETE: {
        # Athletes can manage their own merchandise and interact with platform
        Resource.USERS: {Permission.READ},  # Can read own profile
        Resource.NEWS: {Permission.READ},
        Resource.MERCHES: {Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE},  # Own merch only
        Resource.EDUCATION: {Permission.READ},
        Resource.JOB_VACANCIES: {Permission.READ},
        Resource.AI_CHATS: {Permission.CREATE, Permission.READ},  # Own chats
        Resource.CART: {Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE},  # Own cart
        Resource.FAVORITES: {Permission.CREATE, Permission.READ, Permission.DELETE},  # Own favorites
        Resource.TRANSACTIONS: {Permission.READ},  # Own transactions
    },
    UserRole.TRAINER: {
        # Trainers can create news and manage their content
        Resource.USERS: {Permission.READ},  # Can read own profile
        Resource.NEWS: {Permission.READ},  # Own news
        Resource.MERCHES: {Permission.READ},
        Resource.EDUCATION: {Permission.READ},
        Resource.JOB_VACANCIES: {Permission.READ},
        Resource.AI_CHATS: {Permission.CREATE, Permission.READ},
        Resource.CART: {Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE},
        Resource.FAVORITES: {Permission.CREATE, Permission.READ, Permission.DELETE},
        Resource.TRANSACTIONS: {Permission.READ},
    },
    UserRole.OBSERVER: {
        # Observers can only read public information
        Resource.USERS: {Permission.READ},  # Can read own profile
        Resource.NEWS: {Permission.READ},
        Resource.MERCHES: {Permission.READ},
        Resource.EDUCATION: {Permission.READ},
        Resource.JOB_VACANCIES: {Permission.READ},
        Resource.AI_CHATS: set(),  # No AI access
        Resource.CART: set(),  # No cart
        Resource.FAVORITES: set(),  # No favorites
        Resource.TRANSACTIONS: set(),  # No transactions
    }
}


def has_permission(user: User, resource: Resource, permission: Permission) -> bool:
    """
    Check if a user has a specific permission for a resource

    Args:
        user: The user to check permissions for
        resource: The resource being accessed
        permission: The permission being requested

    Returns:
        bool: True if user has permission, False otherwise
    """
    # CRITICAL: Superusers have ALL permissions on ALL resources
    # This is checked FIRST and separately from role-based permissions
    if user.is_superuser:
        return True

    # Get the permissions for this user's role
    role_permissions = ROLE_PERMISSIONS.get(user.role, {})
    resource_permissions = role_permissions.get(resource, set())

    # Check if the permission is in the set
    return permission in resource_permissions


def check_permission(user: User, resource: Resource, permission: Permission) -> None:
    """
    Check if user has permission, raise HTTPException if not

    Args:
        user: The user to check permissions for
        resource: The resource being accessed
        permission: The permission being requested

    Raises:
        HTTPException: If user doesn't have the required permission
    """
    if not has_permission(user, resource, permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You don't have permission to {permission.value} {resource.value}"
        )


async def verify_resource_ownership(
        resource_id: int,
        user: User,
        model_class,
        db: AsyncSession,
        owner_field: str = "user_id"
) -> bool:
    """
    Verify that a user owns a specific resource

    Args:
        resource_id: ID of the resource
        user: User to verify ownership for
        model_class: SQLAlchemy model class
        db: Database session
        owner_field: Name of the field that stores the owner ID

    Returns:
        bool: True if user owns the resource or is superuser/has permission

    Raises:
        HTTPException: If resource not found
    """
    # Superusers can access all resources
    if user.is_superuser:
        return True

    # Fetch the resource
    result = await db.execute(select(model_class).where(model_class.id == resource_id))
    resource = result.scalar_one_or_none()

    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{model_class.__name__} not found"
        )

    # Check ownership
    if hasattr(resource, owner_field):
        return getattr(resource, owner_field) == user.id

    return False


def check_ownership(
        resource_id: int,
        user: User,
        model_class,
        db: AsyncSession,
        owner_field: str = "user_id"
):
    """
    Dependency to check resource ownership

    Raises:
        HTTPException: If user doesn't own the resource
    """

    async def ownership_checker():
        if not await verify_resource_ownership(resource_id, user, model_class, db, owner_field):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You don't have permission to access this {model_class.__name__}"
            )
        return True

    return ownership_checker


def require_permissions(resource: Resource, permissions: List[Permission]):
    """
    Dependency factory to require specific permissions

    Usage:
        @router.post("/news", dependencies=[Depends(require_permissions(Resource.NEWS, [Permission.CREATE]))])
        async def create_news(...):
            ...
    """

    async def permission_checker(user: User = Depends(get_current_active_user)):
        for permission in permissions:
            check_permission(user, resource, permission)
        return user

    return permission_checker


def require_roles(allowed_roles: List[UserRole]):
    """
    Dependency factory to require specific roles

    NOTE: Superusers are ALWAYS allowed regardless of the allowed_roles list

    Usage:
        @router.post("/admin/users", dependencies=[Depends(require_roles([UserRole.ADMIN]))])
        async def create_user(...):
            ...
    """

    async def role_checker(user: User = Depends(get_current_active_user)):
        # Superusers always pass
        if user.is_superuser:
            return user

        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This endpoint requires one of these roles: {', '.join([r.value for r in allowed_roles])}"
            )

        return user

    return role_checker


def require_superuser():
    """
    Dependency to require superuser access ONLY
    This is the STRICTEST permission check - only for superuser-only endpoints

    Usage:
        @router.delete("/admin/users/{id}", dependencies=[Depends(require_superuser())])
        async def delete_user(...):
            ...
    """

    async def superuser_checker(user: User = Depends(get_current_active_user)):
        if not user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Superuser access required"
            )
        return user

    return superuser_checker


def require_admin_or_superuser():
    """
    Dependency to require admin OR superuser access
    Used for endpoints that both admins and superusers should access

    Usage:
        @router.get("/admin/dashboard", dependencies=[Depends(require_admin_or_superuser())])
        async def admin_dashboard(...):
            ...
    """

    async def admin_checker(user: User = Depends(get_current_active_user)):
        if not (user.is_superuser or user.role == UserRole.ADMIN):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin or Superuser access required"
            )
        return user

    return admin_checker


# Import this to avoid circular imports
from app.core.security import get_current_active_user

__all__ = [
    "Permission",
    "Resource",
    "ROLE_PERMISSIONS",
    "has_permission",
    "check_permission",
    "verify_resource_ownership",
    "check_ownership",
    "require_permissions",
    "require_roles",
    "require_superuser",
    "require_admin_or_superuser",
]