from dotenv import load_dotenv
from fastapi import FastAPI, Request, Depends, HTTPException, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError, ResponseValidationError
from fastapi.security import OAuth2PasswordBearer
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.sessions import SessionMiddleware
from fastapi.openapi.utils import get_openapi
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

import time
import json
from typing import Callable
import logging
import traceback
from datetime import datetime
from enum import Enum as _Enum


from app.core.config import settings
from app.core.rate_limiter import RateLimiter
from app.core.security import verify_password
from app.api.v1.router import api_router
from app.db.session import engine, get_db
from app.models.user import User, UserRole

# Admin panel imports
from sqladmin import Admin
from app.admin.auth import get_admin_auth
from app.admin.views import (
    NewsAdmin,
    MerchAdmin,
    EducationAdmin,
    JobVacancyAdmin
)

load_dotenv()

# ----------------------------------------------------------------------------
# Logging configuration
# ----------------------------------------------------------------------------
try:
    level_name = str(getattr(settings, "LOG_LEVEL", "INFO")).upper()
    _level = getattr(logging, level_name, logging.INFO)
except Exception:
    _level = logging.INFO
logging.basicConfig(level=_level, format='%(asctime)s | %(levelname)s | %(name)s | %(message)s')
logger = logging.getLogger("app")

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="O'zbekiston sportchilari va murabbiylarining ochiq raqamli platformasi",
    docs_url=None,  # Disable default docs
    redoc_url=None,  # Disable default redoc
    openapi_url=None,  # Disable default openapi.json
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def custom_openapi():
    """Custom OpenAPI schema with OAuth2 authentication ONLY"""
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="O'zbekiston sportchilari va murabbiylarining ochiq raqamli platformasi",
        routes=app.routes,
    )

    # Add ONLY OAuth2 security scheme (NO HTTPBasic)
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": "/api/v1/auth/login",
                    "scopes": {}
                }
            }
        }
    }

    openapi_schema["security"] = [{"OAuth2PasswordBearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# GZip Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Session Middleware (REQUIRED for docs login and admin panel)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="sport_portal_session",
    max_age=3600,  # 1 hour
    same_site="lax",
    https_only=False  # Set to True in production with HTTPS
)

# Rate Limiter
rate_limiter = RateLimiter()


# ============================================================================
# SWAGGER DOCS AUTHENTICATION - SUPERUSER ONLY (STRICT CHECK!)
# ============================================================================

async def is_superuser_authenticated(request: Request) -> bool:

    # 1) Allow fallback session-based superuser when DB is unavailable
    if request.session.get("docs_authenticated") and request.session.get("docs_static_superuser"):
        return True

    user_id = request.session.get("docs_user_id")

    # Not logged in to docs
    if not user_id:
        return False

    try:
        async for db in get_db():
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()

            # User not found
            if not user:
                request.session.clear()
                return False

            # User is not active
            if not user.is_active:
                request.session.clear()
                return False

            # CRITICAL CHECK: User is NOT a superuser
            if not user.is_superuser:
                request.session.clear()
                return False

            # All checks passed - user IS a superuser
            return True

    except Exception as e:
        print(f"❌ Error checking superuser status: {e}")
        request.session.clear()
        return False

    return False


@app.get("/docs/login", response_class=HTMLResponse, include_in_schema=False)
async def docs_login_page(request: Request):
    # Read and clear any previous error message from session
    err = request.session.get("docs_error")
    if err:
        try:
            del request.session["docs_error"]
        except Exception:
            pass

    error_html = f"<div style='color:#b91c1c;background:#fee2e2;border:1px solid #fecaca;padding:10px;border-radius:4px;margin-bottom:12px;font-size:13px'>{err}</div>" if err else ""

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sign In</title>
        <style>
            body {{ font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8f9fa; }}
            .card {{ background: white; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); width: 320px; text-align: center; }}
            input {{ width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #dadce0; border-radius: 4px; box-sizing: border-box; font-size: 14px; }}
            button {{ width: 100%; padding: 10px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; margin-top: 16px; }}
            h2 {{ font-weight: 400; margin-bottom: 24px; }}
            .hint {{ font-size: 12px; color:#6b7280; margin-top: 8px; }}
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Sign in</h2>
            {error_html}
            <form method="post" action="/docs/login">
                <input type="text" name="email" placeholder="Email or docs username" required autofocus>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Next</button>
            </form>
            <div class="hint">Tip: If the database is down, you can use the fallback docs credentials from settings.</div>
        </div>
    </body>
    </html>
    """


@app.post("/docs/login", include_in_schema=False)
async def docs_login(
        request: Request,
        email: str = Form(...),
        password: str = Form(...),
        db: AsyncSession = Depends(get_db)
):
    try:
        # Query user by email
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        # User doesn't exist
        if not user:
            request.session["docs_error"] = "Invalid email or password"
            return RedirectResponse(url="/docs/login", status_code=302)

        # Wrong password
        if not verify_password(password, user.hashed_password):
            request.session["docs_error"] = "Invalid email or password"
            return RedirectResponse(url="/docs/login", status_code=302)

        # User is not active
        if not user.is_active:
            request.session["docs_error"] = "Your account is inactive. Please contact an administrator."
            return RedirectResponse(url="/docs/login", status_code=302)

        if not user.is_superuser:
            print(f"⛔ Docs access DENIED for {user.email} (not a superuser)")
            request.session[
                "docs_error"] = f"Access DENIED. You are logged in as '{user.role.value}'. Only SUPERUSER accounts can access the API documentation."
            return RedirectResponse(url="/docs/login", status_code=302)

        # All checks passed! User is a superuser
        request.session.update({
            "docs_user_id": user.id,
            "docs_email": user.email,
            "docs_authenticated": True
        })

        print(f"✅ Docs access GRANTED: {user.email} (SUPERUSER)")

        return RedirectResponse(url="/docs", status_code=302)

    except Exception as e:
        # If DB is unreachable or any error occurs, allow a safe fallback using settings.DOCS_USERNAME/DOCS_PASSWORD
        print(f"❌ Docs login error: {e}")
        try:
            if email == settings.DOCS_USERNAME and password == settings.DOCS_PASSWORD:
                # Create a session that marks the user as a static superuser (no DB lookup required)
                request.session.update({
                    "docs_authenticated": True,
                    "docs_email": email,
                    "docs_static_superuser": True
                })
                print("✅ Docs access GRANTED via fallback credentials (static superuser)")
                return RedirectResponse(url="/docs", status_code=302)
        except Exception as e2:
            print(f"Fallback check error: {e2}")

        request.session["docs_error"] = (
            "Login failed. If the database is down, use the fallback docs credentials or start the DB and try again."
        )
        return RedirectResponse(url="/docs/login", status_code=302)


@app.get("/docs/logout", include_in_schema=False)
async def docs_logout(request: Request):
    """Logout from documentation access"""
    user_email = request.session.get("docs_email", "unknown")
    print(f"👋 Docs logout: {user_email}")

    request.session.clear()
    return RedirectResponse(url="/docs/login", status_code=302)


@app.get("/docs", response_class=HTMLResponse, include_in_schema=False)
async def custom_swagger_ui(request: Request):
    if not await is_superuser_authenticated(request):
        print("⛔ Unauthorized docs access attempt - redirecting to login")
        return RedirectResponse(url="/docs/login", status_code=302)

    # Get user info for display
    user_email = request.session.get("docs_email", "Unknown")

    schema = app.openapi()
    schema_json = json.dumps(schema)

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
        <title>API Docs</title>
        <style>
            /* Minimal top bar for logout only */
            .nav {{ display: flex; justify-content: space-between; padding: 10px; background: #111; color: white; font-family: sans-serif; }}
            .nav a {{ color: #3b82f6; text-decoration: none; font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="nav">
            <span>Logged in as: {user_email}</span>
            <a href="/docs/logout">Logout</a>
        </div>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script>
            SwaggerUIBundle({{
                spec: {schema_json},
                dom_id: '#swagger-ui',
                presets: [SwaggerUIBundle.presets.apis],
                layout: 'BaseLayout'
            }});
        </script>
    </body>
    </html>
    """


@app.get("/openapi.json", include_in_schema=False)
async def get_openapi_json(request: Request):
    """Serve OpenAPI schema (SUPERUSER ONLY)"""
    if not await is_superuser_authenticated(request):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superuser access required"
        )
    return app.openapi()


print("🔧 Setting up admin panel...")

try:
    authentication_backend = get_admin_auth()

    admin = Admin(
        app=app,
        engine=engine,
        title="Sport Milliy Portali - Admin Panel",
        logo_url=None,
        authentication_backend=authentication_backend,
    )

    admin.add_view(NewsAdmin)
    admin.add_view(MerchAdmin)
    admin.add_view(EducationAdmin)
    admin.add_view(JobVacancyAdmin)

    print("✅ Admin panel configured successfully!")

except Exception as e:
    print(f"⚠️  Warning: Could not set up admin panel: {e}")


@app.middleware("http")
async def add_process_time_header(request: Request, call_next: Callable):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next: Callable):
    client_ip = request.client.host

    skip_paths = ["/health", "/admin", "/docs"]
    if any(request.url.path.startswith(path) for path in skip_paths):
        return await call_next(request)

    if not await rate_limiter.check_rate_limit(client_ip):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Rate limit exceeded. Please try again later."}
        )

    response = await call_next(request)
    return response


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    headers = getattr(exc, "headers", None)
    # Log 4xx/5xx HTTP errors for visibility
    if exc.status_code >= 500:
        logger.exception(f"HTTPException {exc.status_code} on {request.method} {request.url.path}: {exc.detail}")
    else:
        logger.warning(f"HTTPException {exc.status_code} on {request.method} {request.url.path}: {exc.detail}")
    if headers is not None:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers=headers,
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.debug(f"Validation error on {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )


# Surface FastAPI ResponseValidationError (response model mismatches) clearly in Swagger
@app.exception_handler(ResponseValidationError)
async def response_validation_exception_handler(request: Request, exc: ResponseValidationError):
    logger.exception(f"Response validation error on {request.method} {request.url.path}: {exc}")
    
    # Sanitize exc.errors() to avoid non-JSON-serializable objects (e.g., ORM instances) in the payload
    def _sanitize(obj):
        # Primitive types pass through
        if obj is None or isinstance(obj, (bool, int, float, str)):
            return obj
        # Datetime to ISO
        if isinstance(obj, datetime):
            return obj.isoformat()
        # Enums to value
        if isinstance(obj, _Enum):
            return obj.value
        # Mapping
        if isinstance(obj, dict):
            return {k: _sanitize(v) for k, v in obj.items()}
        # Iterables
        if isinstance(obj, (list, tuple, set)):
            return [_sanitize(v) for v in obj]
        # Fallback to string representation
        try:
            return str(obj)
        except Exception:
            return "<unserializable>"

    sanitized_errors = None
    try:
        if hasattr(exc, "errors"):
            raw = exc.errors()
            sanitized_errors = _sanitize(raw)
    except Exception:
        sanitized_errors = None
    # When configured, expose detailed errors with traceback to speed up debugging
    if settings.DEBUG or getattr(settings, "EXPOSE_ERRORS_IN_RESPONSE", False):
        import traceback as _tb
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "error": type(exc).__name__,
                "message": str(exc),
                "errors": sanitized_errors,
                "path": str(request.url.path),
                "method": request.method,
                "trace": _tb.format_exc(),
            },
        )
    # Otherwise return a minimal but explicit payload
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error": type(exc).__name__,
            "message": "Response data does not match the documented schema.",
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # Log full traceback for debugging
    logger.exception(f"Unhandled exception on {request.method} {request.url.path}: {exc}")

    if settings.DEBUG or getattr(settings, "EXPOSE_ERRORS_IN_RESPONSE", False):
        tb = traceback.format_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "error": type(exc).__name__,
                "message": str(exc),
                "path": str(request.url.path),
                "method": request.method,
                "trace": tb,
            }
        )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )


@app.on_event("startup")
async def startup_event():
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print("=" * 70)
    print(f"📊 Admin Panel:        http://localhost:8000/admin")
    print(f"📖 API Documentation:  http://localhost:8000/docs")
    print(f"   ⚠️  WARNING: SUPERUSER ONLY - Others will be DENIED")
    print(f"🔐 Docs Login:         http://localhost:8000/docs/login")
    print(f"🔑 API Auth:           POST /api/v1/auth/login")
    print("=" * 70)
    print("✅ Application started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    print("👋 Shutting down application...")


@app.get("/health", tags=["Health"])
async def health_check(db: AsyncSession = Depends(get_db)):
    payload = {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "timestamp": time.time()
    }

    # In DEBUG mode, attempt a lightweight DB check to surface connectivity issues
    if settings.DEBUG:
        try:
            await db.execute(text("SELECT 1"))
            payload["database"] = {"ok": True}
        except Exception as e:
            logger.exception(f"Health DB check failed: {e}")
            payload["database"] = {
                "ok": False,
                "error": type(e).__name__,
                "message": str(e)
            }

    return payload


@app.get("/", tags=["Root"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": "O'zbekiston sportchilari va murabbiylarining ochiq raqamli platformasi",
        "docs": "/docs (SUPERUSER ONLY)",
        "docs_login": "/docs/login",
        "admin": "/admin",
        "health": "/health",
        "api": "/api/v1",
        "authentication": {
            "login": "/api/v1/auth/login",
            "register": "/api/v1/auth/register"
        }
    }


# Include API router
app.include_router(api_router, prefix="/api/v1")


# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )