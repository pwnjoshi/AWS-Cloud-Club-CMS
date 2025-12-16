export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function login(username, password) {
    const response = await fetch(`${API_URL}/api-token-auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
}

export function logout() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}

export async function authenticatedFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        ...options.headers,
    };

    // Only set Content-Type for JSON if body is not FormData
    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        logout();
        window.location.href = '/login';
    }

    return response;
}

export async function getNews() {
    const response = await fetch(`${API_URL}/api/news/`);
    if (!response.ok) {
        throw new Error('Failed to fetch news');
    }
    return response.json();
}

export async function createNews(newsData) {
    const response = await authenticatedFetch('/api/news/', {
        method: 'POST',
        body: JSON.stringify(newsData),
    });
    if (!response.ok) {
        throw new Error('Failed to create news');
    }
    return response.json();
}
