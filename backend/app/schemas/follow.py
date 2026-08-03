from pydantic import BaseModel


class FollowToggleResponse(BaseModel):
    """Result of POST /follows/toggle/{user_id}"""
    status: str  # "followed" | "unfollowed"
    followers_count: int


class FollowStatusResponse(BaseModel):
    """Result of GET /follows/status/{user_id}"""
    is_following: bool
