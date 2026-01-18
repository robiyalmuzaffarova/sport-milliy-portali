# API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

All protected endpoints require Bearer token authentication:
```
Authorization: Bearer <access_token>
```

### POST /auth/login
Login with email and password

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### POST /auth/register
Register new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "athlete"
}
```

## Users

### GET /users/me
Get current user profile (protected)

### PUT /users/me
Update current user profile (protected)

## News

### GET /news
Get all news articles

**Query Parameters:**
- `category`: Filter by category (football, boxing, wrestling, general)
- `skip`: Pagination offset
- `limit`: Results per page

### POST /news
Create news article (admin/trainer only)

## Merchandise

### GET /merches
Get all merchandise

### POST /merches
Create merchandise (athlete/trainer only)

## AI Buddy

### POST /ai-buddy/chat
Chat with AI assistant

**Request:**
```json
{
  "message": "What sports do you recommend?"
}
```

For complete API documentation, visit: http://localhost:8000/docs
