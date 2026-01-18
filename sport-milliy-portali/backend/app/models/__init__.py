# Import model modules so their Table metadata is registered on Base
from . import (
    user,
    news,
    merch,
    favorite,
    cart,
    ai_chat,
    job_vacancy,
    education,
    transaction
)

__all__ = [
    "user",
    "news",
    "merch",
    "favorite",
    "cart",
    "ai_chat",
    "job_vacancy",
    "education",
    "transaction"
]
