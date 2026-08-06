import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

const cookieName = 'fengtai_admin_session';
const sessionHours = 24 * 7;
const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'fengtai-local-session-secret';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

type SessionPayload = {
  role: 'admin';
  exp: number;
};

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: SessionPayload) {
  const body = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', sessionSecret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verify(token: string | undefined) {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = crypto.createHmac('sha256', sessionSecret).update(body).digest('base64url');
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload || payload.role !== 'admin' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function readCookie(header: string | undefined, name: string) {
  if (!header) return undefined;
  const pair = header.split(';').map(item => item.trim()).find(item => item.startsWith(`${name}=`));
  return pair?.slice(name.length + 1);
}

export function getAdminSession(request: Request) {
  return verify(readCookie(request.headers.cookie, cookieName));
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const session = getAdminSession(request);
  if (!session) {
    response.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

export function handleLogin(request: Request, response: Response) {
  const { password } = request.body as { password?: string };
  if (!password || password !== adminPassword) {
    response.status(401).json({ error: 'Invalid password' });
    return;
  }
  const token = sign({ role: 'admin', exp: Date.now() + sessionHours * 60 * 60 * 1000 });
  response.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: sessionHours * 60 * 60 * 1000,
    path: '/',
  });
  response.json({ ok: true });
}

export function handleLogout(request: Request, response: Response) {
  response.clearCookie(cookieName, { path: '/' });
  response.json({ ok: true });
}

export function handleSession(request: Request, response: Response) {
  response.json({ authenticated: Boolean(getAdminSession(request)) });
}
