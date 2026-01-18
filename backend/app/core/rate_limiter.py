import time
from typing import Optional
import redis.asyncio as aioredis  # Ensure you use the async version
from app.core.config import settings

class RateLimiter:
    def __init__(self):
        # 1. Added the missing 'prefix' attribute to fix the first error
        self.prefix = "rl:" 
        self.redis_client = None
        self.redis_available = False
        
        # Initial check to see if Redis is up
        try:
            # Note: We don't await in __init__, we just setup the client
            self.redis_client = aioredis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=0,
                decode_responses=True
            )
            self.redis_available = True
        except Exception as e:
            print(f"⚠️ Redis not available: {e}")
            self.redis_available = False

    async def check_rate_limit(
        self,
        identifier: str,
        limit_per_minute: Optional[int] = None
    ) -> bool:
        """Checks if request is within limit. Returns True if OK."""
        if not self.redis_available or self.redis_client is None:
            return True # Fail open if Redis is down
            
        if limit_per_minute is None:
            limit_per_minute = settings.RATE_LIMIT_PER_MINUTE
        
        try:
            # 2. Fixed 'await' error: self.redis_client is now an async client
            current_minute = int(time.time() / 60)
            key = f"{self.prefix}{identifier}:{current_minute}"
            
            # Use async context/calls
            count = await self.redis_client.incr(key)
            
            if count == 1:
                await self.redis_client.expire(key, 60)
            
            return count <= limit_per_minute
        
        except Exception as e:
            print(f"Rate limiter error: {e}")
            return True