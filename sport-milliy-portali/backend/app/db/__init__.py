"""Database package initializer."""

from .base import Base, BaseModel  # re-export for convenient imports

__all__ = ["Base", "BaseModel"]
