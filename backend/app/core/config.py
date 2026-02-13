"""
Application Configuration using Pydantic Settings
"""
from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, validator
from typing import List, Optional, Union, Any
import secrets

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    
    # Application
    APP_NAME: str = "Sport Milliy Portali"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    # When True, include detailed error information (exception type, message, traceback)
    # in HTTP 500 responses to help debugging during development
    EXPOSE_ERRORS_IN_RESPONSE: bool = True

    # Admin Panel
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "changeme"

    # Documentation
    DOCS_USERNAME: str = "admin"
    DOCS_PASSWORD: str = "changeme"

    # Database
    DATABASE_URL: PostgresDsn
    DB_ECHO: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # RabbitMQ
    RABBITMQ_URL: str = "amqp://sportuser:sportpass@localhost:5672/"
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: Union[List[str], str] = ["GET", "POST", "PUT", "DELETE", "PATCH"]
    CORS_ALLOW_HEADERS: Union[List[str], str] = ["*"]
    
    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v
    
    @validator("CORS_ALLOW_METHODS", pre=True)
    def assemble_cors_methods(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v
    
    @validator("CORS_ALLOW_HEADERS", pre=True)
    def assemble_cors_headers(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v
    
    # Translation Service
    TRANSLATION_SERVICE: str = "google"  # google, deepl, libretranslate
    GOOGLE_TRANSLATE_API_KEY: Optional[str] = None
    DEEPL_API_KEY: Optional[str] = None
    LIBRETRANSLATE_URL: Optional[str] = None
    
    # Payment Gateways
    CLICK_MERCHANT_ID: Optional[str] = None
    CLICK_SERVICE_ID: Optional[str] = None
    CLICK_SECRET_KEY: Optional[str] = None
    CLICK_RETURN_URL: str = "http://localhost:3000/payment/callback"
    
    PAYME_MERCHANT_ID: Optional[str] = None
    PAYME_SECRET_KEY: Optional[str] = None
    PAYME_ENDPOINT: str = "https://checkout.paycom.uz"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: str = "noreply@sportmilliyportali.uz"
    SMTP_FROM_NAME: str = "Sport Milliy Portali"
    
    # File Upload
    UPLOAD_DIR: str = "/app/uploads"
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "gif", "webp"]
    ALLOWED_DOCUMENT_EXTENSIONS: List[str] = ["pdf", "doc", "docx"]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Admin
    FIRST_SUPERUSER_EMAIL: str = "admin@sportmilliyportali.uz"
    FIRST_SUPERUSER_PASSWORD: str = "changeme123"
    FIRST_SUPERUSER_FULLNAME: str = "Admin User"
    
    # Subscription
    FREE_TRAINERS_LIMIT: int = 20000
    MONTHLY_SUBSCRIPTION_PRICE: int = 9900  # UZS
    
    # AI Configuration
    AI_MODEL_ENDPOINT: Optional[str] = None
    AI_ENABLED: bool = True
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30
    WS_MAX_CONNECTIONS: int = 1000
    
    # Celery
    CELERY_BROKER_URL: str = "amqp://sportuser:sportpass@localhost:5672/"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"
    CELERY_TASK_SERIALIZER: str = "json"
    CELERY_RESULT_SERIALIZER: str = "json"
    CELERY_TIMEZONE: str = "Asia/Tashkent"
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    PROMETHEUS_ENABLED: bool = True
    
    # Feature Flags
    ENABLE_REGISTRATION: bool = True
    ENABLE_AI_BUDDY: bool = True
    ENABLE_PAYMENTS: bool = True
    ENABLE_DONATIONS: bool = True
    ENABLE_MERCHANDISE: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
