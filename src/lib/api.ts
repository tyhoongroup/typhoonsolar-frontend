'use client';

/**
 * Typhoon Solar - Unified Authenticated API Client
 * Automatically attaches JWT bearer tokens and redirects to '/' (login) if unauthenticated or expired.
 */

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('accessToken');
  if (!token || token === 'null' || token === 'undefined') return null;
  return token;
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  if (!user || user === 'null' || user === 'undefined') return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function clearAuthAndRedirect(targetUrl = '/') {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = targetUrl;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();

  if (!token) {
    clearAuthAndRedirect('/');
    throw new Error('No authentication token found. Redirecting to login...');
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // If token is invalid, expired, or forbidden due to bad session
  if (res.status === 401) {
    clearAuthAndRedirect('/');
    throw new Error('Session expired or invalid token. Redirecting to login...');
  }

  return res;
}

