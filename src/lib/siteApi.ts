import type { SiteContent } from '../types/site';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path}`;
}

function publicMediaUrl(url: string) {
  if (!url.startsWith('/uploads/')) return url;
  return apiUrl(url);
}

function readCookie(name: string) {
  return document.cookie
    .split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function isStateChanging(method: string) {
  return !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method || 'GET';
  const csrfToken = path.startsWith('/api/admin') && path !== '/api/admin/login' && isStateChanging(method)
    ? readCookie('fengtai_csrf_token')
    : undefined;
  const headers = init?.body instanceof FormData
    ? { ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}), ...(init?.headers || {}) }
    : {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...(init?.headers || {})
    };
  const response = await fetch(apiUrl(path), {
    credentials: 'include',
    headers,
    ...init,
  });
  if (!response.ok) {
    const message = await response.text();
    let parsedError = '';
    try {
      const parsed = JSON.parse(message) as { error?: string };
      parsedError = parsed.error || '';
    } catch {
      parsedError = '';
    }
    throw new Error(parsedError || message || `请求失败：${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type AdminRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type Permission = 'content:write' | 'site-content:write' | 'media:write' | 'users:manage' | 'logs:read' | 'analytics:read';

export type AdminUser = {
  id: number;
  username: string;
  displayName: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type AdminSession = {
  authenticated: boolean;
  user: AdminUser | null;
  permissions: Permission[];
};

export type AdminLog = {
  id: number;
  user_id?: number | null;
  username?: string | null;
  action: string;
  target: string;
  detail?: string | null;
  method?: string;
  path?: string;
  status?: number;
  duration_ms?: number;
  ip?: string | null;
  user_agent?: string | null;
  created_at: string;
};

export type AnalyticsSummary = {
  totalViews: number;
  uniqueVisitors: number;
  productViews: number;
  todayViews: number;
};

export type PageAnalytics = {
  path: string;
  title: string;
  views: number;
  visitors: number;
  lastViewedAt: string;
};

export type ProductAnalytics = {
  productSlug: string;
  productName: string;
  views: number;
  visitors: number;
  lastViewedAt: string;
};

export function loadSite() {
  return request<SiteContent>('/api/site');
}

export function saveSite(site: SiteContent) {
  return request<SiteContent>('/api/admin/site', {
    method: 'PUT',
    body: JSON.stringify(site),
  });
}

export function saveSiteContent(site: SiteContent) {
  return request<SiteContent>('/api/admin/site-content', {
    method: 'PUT',
    body: JSON.stringify(site),
  });
}

export function resetSite() {
  return request<SiteContent>('/api/admin/site/reset', {
    method: 'POST',
  });
}

export function loginAdmin(username: string, password: string) {
  return request<{ ok: boolean; user: AdminUser; permissions: Permission[] }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logoutAdmin() {
  return request<{ ok: boolean }>('/api/admin/logout', {
    method: 'POST',
  });
}

export function getSession() {
  return request<AdminSession>('/api/auth/session');
}

type MediaRecord = {
  url: string;
  publicUrl?: string;
  kind: string;
  name: string;
  originalName: string;
  size: number;
  updatedAt: string;
};

export function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<MediaRecord>('/api/admin/media', {
    method: 'POST',
    body: formData,
  }).then(media => ({ ...media, publicUrl: media.publicUrl || publicMediaUrl(media.url) }));
}

export function listMedia() {
  return request<MediaRecord[]>('/api/admin/media').then(media =>
    media.map(item => ({ ...item, publicUrl: item.publicUrl || publicMediaUrl(item.url), url: publicMediaUrl(item.url) }))
  );
}

export function listUsers() {
  return request<AdminUser[]>('/api/admin/users');
}

export function createUser(input: { username: string; displayName?: string; password: string; role: AdminRole }) {
  return request<AdminUser>('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateUser(id: number, input: { displayName?: string; password?: string; role?: AdminRole; active?: boolean }) {
  return request<AdminUser>(`/api/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function listOperationLogs(limit = 100) {
  return request<AdminLog[]>(`/api/admin/operation-logs?limit=${limit}`);
}

export function listRequestLogs(limit = 100) {
  return request<AdminLog[]>(`/api/admin/request-logs?limit=${limit}`);
}

export function loadAnalyticsSummary() {
  return request<AnalyticsSummary>('/api/admin/analytics/summary');
}

export function loadPageAnalytics(limit = 20) {
  return request<PageAnalytics[]>(`/api/admin/analytics/pages?limit=${limit}`);
}

export function loadProductAnalytics(limit = 50) {
  return request<ProductAnalytics[]>(`/api/admin/analytics/products?limit=${limit}`);
}

export function trackPageView(input: {
  sessionId: string;
  path: string;
  title?: string;
  referrer?: string;
  productSlug?: string;
  productName?: string;
}) {
  const payload = JSON.stringify(input);
  const url = apiUrl('/api/analytics/view');
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
    return;
  }
  void fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  });
}
