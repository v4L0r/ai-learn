/**
 * API client for backend requests.
 * Uses relative /api in dev (Vite proxy to backend); override with VITE_API_URL if needed.
 */
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (includeAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // Server returned non-JSON (e.g. HTML error page)
    if (!res.ok) {
      const err = new Error(`Request failed: ${res.status}. Check server is running and returns JSON.`);
      err.status = res.status;
      err.data = { raw: text.slice(0, 200) };
      throw err;
    }
  }
  if (!res.ok) {
    const err = new Error(data.message || data.error || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get(endpoint, options = {}) {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(options.skipAuth),
      ...options,
    }).then(handleResponse);
  },

  post(endpoint, body, options = {}) {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(options.skipAuth),
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }).then(handleResponse);
  },

  put(endpoint, body, options = {}) {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(options.skipAuth),
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }).then(handleResponse);
  },

  delete(endpoint, options = {}) {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(options.skipAuth),
      ...options,
    }).then(handleResponse);
  },
};

// Auth API helpers (match common backend routes)
export const authApi = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }, { skipAuth: true }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }, { skipAuth: true }),

  me: () => api.get('/auth/me'),
};

// Topics API (for TopicSubmit / dashboard)
export const topicsApi = {
  submit: (title, description) =>
    api.post('/topics', { title, description }),

  list: () => api.get('/topics'),
};
