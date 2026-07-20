export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  TIMEOUT: 10000,
}

export const API_ENDPOINTS = {
  // ========== NEWS ==========
  NEWS: '/api/v1/news',
  NEWS_BY_ID: (id: string | number) => `/api/v1/news/${id}`,
  NEWS_MY_ARTICLES: '/api/v1/news/my/articles',

  // ========== MERCHANDISE ==========
  MERCH: '/api/v1/merches',
  MERCH_BY_ID: (id: string | number) => `/api/v1/merches/${id}`,
  MERCH_MY_MERCHANDISE: '/api/v1/merches/my/merchandise',

  // ========== USERS ==========
  USERS: '/api/v1/users',
  USERS_BY_ID: (id: string | number) => `/api/v1/users/${id}`,
  USERS_ME: '/api/v1/users/me',
  USERS_ATHLETES: '/api/v1/users?role=athlete',
  USERS_TRAINERS: '/api/v1/users?role=trainer',

  // ========== AUTHENTICATION ==========
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_REGISTER: '/api/v1/auth/register',
  AUTH_ME: '/api/v1/auth/me',
  AUTH_LOGOUT: '/api/v1/auth/logout',
  AUTH_REFRESH: '/api/v1/auth/refresh',

  // ========== EDUCATION ==========
  EDUCATION: '/api/v1/education',
  EDUCATION_BY_ID: (id: string | number) => `/api/v1/education/${id}`,

  // ========== JOB VACANCIES ==========
  JOB_VACANCIES: '/api/v1/job-vacancies',
  JOB_VACANCIES_BY_ID: (id: string | number) => `/api/v1/job-vacancies/${id}`,

  // ========== FAVORITES ==========
  FAVORITES: '/api/v1/favorites',
  FAVORITES_BY_ID: (id: string | number) => `/api/v1/favorites/${id}`,

  // ========== CART ==========
  CART: '/api/v1/cart',
  CART_BY_ID: (id: string | number) => `/api/v1/cart/${id}`,
  CART_CLEAR: '/api/v1/cart/clear',

  // ========== AI BUDDY ==========
  AI_BUDDY_CHAT: '/api/v1/ai-buddy/chat',

  // ========== HEALTH & INFO ==========
  HEALTH: '/health',
  ROOT: '/',
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface NewsItem {
  id: number
  title: string
  slug: string
  content: string
  snippet: string
  image_url: string | null
  category: string
  views_count: number
  created_at: string
  updated_at: string
  author_id: number | null
  author?: UserProfile
}

export interface MerchItem {
  id: number
  name: string
  brand: string
  description: string
  price: number
  stock: number
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
  owner_id: number | null
  owner?: UserProfile
}

export interface UserProfile {
  id: number
  email: string
  full_name: string
  avatar_url: string | null
  role: 'ATHLETE' | 'TRAINER' | 'ADMIN' | 'SUPERUSER'
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface EducationItem {
  id: number
  title: string
  description: string
  content: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface JobVacancy {
  id: number
  title: string
  description: string
  requirements: string
  location: string
  salary_range: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FavoriteItem {
  id: number
  user_id: number
  resource_type: string
  resource_id: number
  created_at: string
}

export interface CartItem {
  id: number
  user_id: number
  merch_id: number
  quantity: number
  created_at: string
  updated_at: string
  merch?: MerchItem
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user?: UserProfile
}

export interface ApiError {
  detail: string
  status?: number
}


/**
 * Build URL with query parameters
 * @param endpoint - Base endpoint
 * @param params - Query parameters
 */
export function buildUrl(endpoint: string, params?: Record<string, any>): string {
  if (!params) return endpoint

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  return queryString ? `${endpoint}?${queryString}` : endpoint
}

/**
 * Get full API URL
 * @param endpoint - Endpoint path
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

export default API_CONFIG