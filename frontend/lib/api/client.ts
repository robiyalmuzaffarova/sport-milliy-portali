const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Enhanced fetch function with better error handling
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  console.log('🌐 [API] Request:', {
    method: options.method || 'GET',
    url,
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log('📡 [API] Response Status:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: endpoint,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          
          // Handle arrays
          if (Array.isArray(errorData)) {
            if (errorData.length > 0 && typeof errorData[0] === 'object') {
              errorMessage = errorData[0]?.detail || errorData[0]?.message || errorData[0]?.msg || 'Error from API';
            }
          }
          // Handle objects
          else if (typeof errorData === 'object' && errorData !== null) {
            errorMessage = errorData.detail || errorData.message || errorData.msg || errorMessage;
          }
        }
      } catch (parseError) {
        // Fall back to default error message
      }
      
      console.warn('⚠️ [API] HTTP Error:', endpoint, '-', errorMessage);
      throw new Error(String(errorMessage));
    }

    const data = await response.json();
    console.log('✅ [API] Success - Response Data:', {
      endpoint,
      responseStructure: {
        keys: typeof data === 'object' && data !== null ? Object.keys(data) : [],
        hasItems: 'items' in data,
        itemsType: Array.isArray(data?.items) ? 'Array' : typeof data?.items,
        itemsCount: Array.isArray(data?.items) ? data.items.length : 0,
        total: data?.total || 'N/A',
      },
      fullResponse: data,
    });

    return data;
  } catch (error: any) {
    console.warn('⚠️ [API] Request failed:', endpoint, '-', error?.message || 'Unknown error');
    throw error;
  }
}

export const newsApi = {
  /**
   * Get all news articles with pagination
   * @param skip - Number of items to skip (pagination)
   * @param limit - Maximum number of items to return
   * @param category - Optional category filter
   * @param search - Optional search query
   */
  getAll: (skip = 0, limit = 10, category?: string, search?: string) => {
    let endpoint = `/news/?skip=${skip}&limit=${limit}`;
    if (category) endpoint += `&category=${category}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    return fetchApi(endpoint);
  },

  /**
   * Get single news article by ID
   */
  getById: (id: string | number) => fetchApi(`/news/${id}/`),

  /**
   * Get current user's news articles (requires authentication)
   */
  getMyArticles: (skip = 0, limit = 10, token: string) => 
    fetchApi(`/news/my/articles/?skip=${skip}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Create new news article (requires authentication)
   */
  create: (data: any, token: string) => 
    fetchApi('/news/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Update news article (requires authentication)
   */
  update: (id: number, data: any, token: string) => 
    fetchApi(`/news/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Delete news article (requires authentication)
   */
  delete: (id: number, token: string) => 
    fetchApi(`/news/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
};

export const usersApi = {
  /**
   * Get list of athletes
   */
  getAthletes: (skip = 0, limit = 10) => 
    fetchApi(`/users?role=athlete&skip=${skip}&limit=${limit}`),

  /**
   * Get list of trainers
   */
  getTrainers: (skip = 0, limit = 10) => 
    fetchApi(`/users?role=trainer&skip=${skip}&limit=${limit}`),

  /**
   * Get user by ID
   */
  getById: (id: string | number) => fetchApi(`/users/${id}/`),

  /**
   * Get current user profile (requires authentication)
   */
  getMe: (token: string) => 
    fetchApi('/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Update current user profile (requires authentication)
   */
  updateMe: (data: any, token: string) => 
    fetchApi('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Authorization': `Bearer ${token}` }
    }),
};

export const merchApi = {
  /**
   * Get all merchandise with pagination
   * @param skip - Number of items to skip
   * @param limit - Maximum number of items to return
   * @param search - Optional search query
   * @param is_available - Optional filter for availability
   */
  
  getAll: (skip = 0, limit = 12, search?: string, is_available?: boolean, filter?: 'discount' | 'new') => {
    let endpoint = `/merches/?skip=${skip}&limit=${limit}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (is_available !== undefined) endpoint += `&is_available=${is_available}`;
    if (filter) endpoint += `&filter=${filter}`;
    return fetchApi(endpoint);
  },

  /**
   * Get single merchandise item by ID
   */
  getById: (id: string | number) => fetchApi(`/merches/${id}/`),

  /**
   * Get current user's merchandise (requires authentication)
   */
  getMyMerchandise: (skip = 0, limit = 10, token: string) => 
    fetchApi(`/merches/my/merchandise?skip=${skip}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Create new merchandise (requires authentication)
   */
  create: (data: any, token: string) => 
    fetchApi('/merches', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Update merchandise (requires authentication)
   */
  update: (id: number, data: any, token: string) => 
    fetchApi(`/merches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Delete merchandise (requires authentication)
   */
  delete: (id: number, token: string) => 
    fetchApi(`/merches/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
};

export const authApi = {
  /**
   * Login with email and password
   * Note: FastAPI OAuth2 expects FormData, not JSON
   */
  login: (data: FormData) => 
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      body: data, // FastAPI OAuth2 expects form-data
    }).then(async res => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.detail || `Login failed (${res.status})`;
        throw new Error(errorMessage);
      }
      return res.json();
    }),

  /**
   * Register new user
   */
  register: (data: any) => 
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch((err: any) => {
      console.error("Registration API error:", err);
      throw err;
    }),

  /**
   * Get current authenticated user
   */
  getMe: (token: string) => 
    fetchApi('/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Logout (client-side)
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },
};

export const jobVacanciesApi = {
  /**
   * Get all job vacancies with pagination and optional filters.
   * @param skip - Number of items to skip (pagination)
   * @param limit - Maximum number of items to return
   * @param search - Optional search query (title/description/company)
   * @param region - Optional list of region values, e.g. ["andijan", "bukhara"]
   * @param employmentType - Optional list of employment type values, e.g. ["full_time"]
   * @param sportType - Optional list of sport type values, e.g. ["football", "tennis"]
   * @param isActive - Optional active-status filter
   */
  getAll: (
    skip = 0,
    limit = 10,
    search?: string,
    region?: string[],
    employmentType?: string[],
    sportType?: string[],
    isActive?: boolean,
  ) => {
    let endpoint = `/job-vacancies/?skip=${skip}&limit=${limit}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (isActive !== undefined) endpoint += `&is_active=${isActive}`;
    region?.forEach((v) => { endpoint += `&region=${encodeURIComponent(v)}`; });
    employmentType?.forEach((v) => { endpoint += `&employment_type=${encodeURIComponent(v)}`; });
    sportType?.forEach((v) => { endpoint += `&sport_type=${encodeURIComponent(v)}`; });
    return fetchApi(endpoint);
  },

  getById: (id: string | number) => fetchApi(`/job-vacancies/${id}/`),
};

export const favoritesApi = {
  getMyFavorites: (token: string, skip = 0, limit = 20) => 
    fetchApi(`/favorites?skip=${skip}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  addFavorite: (resourceType: string, resourceId: number, token: string) => 
    fetchApi('/favorites', {
      method: 'POST',
      body: JSON.stringify({ resource_type: resourceType, resource_id: resourceId }),
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  removeFavorite: (favoriteId: number, token: string) => 
    fetchApi(`/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
};

export const cartApi = {
  getMyCart: (token: string) => 
    fetchApi('/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  addToCart: (merchId: number, quantity: number, token: string) => 
    fetchApi('/cart', {
      method: 'POST',
      body: JSON.stringify({ merch_id: merchId, quantity }),
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  updateCartItem: (cartItemId: number, quantity: number, token: string) => 
    fetchApi(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  removeFromCart: (cartItemId: number, token: string) => 
    fetchApi(`/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  clearCart: (token: string) => 
    fetchApi('/cart/clear', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
};

export const aiBuddyApi = {
  chat: (message: string, token: string) => 
    fetchApi('/ai-buddy/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { 'Authorization': `Bearer ${token}` }
    }),
};

export const educationApi = {
  /**
   * Get all education institutions with pagination
   * @param skip - Number of items to skip (pagination)
   * @param limit - Maximum number of items to return
   * @param region - Optional region filter
   * @param type - Optional type filter (academy, federation, school, club)
   * @param search - Optional search query
   */
  getAll: (skip = 0, limit = 10, region?: string, type?: string, search?: string) => {
    let endpoint = `/education/?skip=${skip}&limit=${limit}`;
    if (region) endpoint += `&region=${encodeURIComponent(region)}`;
    if (type) endpoint += `&type=${encodeURIComponent(type)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    return fetchApi(endpoint);
  },

  /**
   * Get single education institution by ID
   */
  getById: (id: string | number) => fetchApi(`/education/${id}/`),

  /**
   * Create new education institution (requires authentication and admin permissions)
   */
  create: (data: any, token: string) => 
    fetchApi('/education', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Update education institution (requires authentication and admin permissions)
   */
  update: (id: number, data: any, token: string) => 
    fetchApi(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  /**
   * Delete education institution (requires authentication and admin permissions)
   */
  delete: (id: number, token: string) => 
    fetchApi(`/education/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL.replace('/api/v1', '')}/health`);
    return response.ok;
  } catch {
    return false;
  }
};