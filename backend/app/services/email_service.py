"""Email Service"""
from typing import List
from app.core.config import settings

class EmailService:
    """Service for sending emails"""
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        body: str,
        html: bool = False
    ) -> bool:
        """Send email - placeholder implementation"""
        print(f"Sending email to {to_email}: {subject}")
        # TODO: Implement actual email sending with SMTP
        return True
    
    async def send_verification_email(self, to_email: str, token: str) -> bool:
        """Send account verification email"""
        subject = "Verify your Sport Milliy Portali account"
        body = f"Click here to verify: {settings.CORS_ORIGINS[0]}/verify?token={token}"
        return await self.send_email(to_email, subject, body)
    
    async def send_password_reset_email(self, to_email: str, token: str) -> bool:
        """Send password reset email"""
        subject = "Reset your password"
        body = f"Click here to reset: {settings.CORS_ORIGINS[0]}/reset-password?token={token}"
        return await self.send_email(to_email, subject, body)
