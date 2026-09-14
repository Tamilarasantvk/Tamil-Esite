import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const SESSION_COOKIE = 'soc_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const resetTokens = globalThis.__adminResetTokens || (globalThis.__adminResetTokens = new Map());
const runtimeCredentials = globalThis.__adminRuntimeCredentials || (globalThis.__adminRuntimeCredentials = { username: null, password: null });

function envValue(name) {
  const value = process.env[name];
  if (typeof value !== 'string') return '';
  const cleaned = value.replace(/^\uFEFF/, '');
  return cleaned.length >= 2 && ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'")))
    ? cleaned.slice(1, -1)
    : cleaned;
}

function credentialsConfigured() {
  return Boolean(currentUsername() && currentPassword());
}

function currentUsername() { return runtimeCredentials.username || envValue('ADMIN_USERNAME').trim(); }
function currentPassword() { return runtimeCredentials.password || envValue('ADMIN_PASSWORD'); }

const mailTransport = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
  ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } })
  : null;

async function notifyAdmin(subject, text) {
  if (!mailTransport || !process.env.CONTACT_EMAIL) return;
  try { await mailTransport.sendMail({ from: process.env.SMTP_USER, to: process.env.CONTACT_EMAIL, subject, text }); } catch (error) { console.error('Admin security email delivery failed:', error); }
}

function signSession(username, expiresAt) {
  const payload = Buffer.from(JSON.stringify({ username, expiresAt })).toString('base64url');
  const signature = crypto.createHmac('sha256', currentPassword()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map((part) => {
    const separator = part.indexOf('=');
    return separator < 0
      ? ['', '']
      : [part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1))];
  }));
}

function validSession(request) {
  if (!credentialsConfigured()) return false;
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = crypto.createHmac('sha256', currentPassword()).update(payload).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return session.username === currentUsername() && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function setCookie(response, value, maxAge) {
  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${process.env.VERCEL ? '; Secure' : ''}`);
}

function json(response, status, body) {
  response.status(status).json(body);
}

export default async function handler(request, response) {
  const path = request.url.split('?')[0].replace(/^\/api\/?/, '').replace(/\/$/, '');

  if (path === 'auth/login' && request.method === 'POST') {
    if (!credentialsConfigured()) return json(response, 503, { error: 'CMS authentication is not configured' });
    const body = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : (request.body || {});
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (username !== currentUsername() || password !== currentPassword()) {
      return json(response, 401, { error: 'Invalid credentials' });
    }
    const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
    setCookie(response, signSession(username, expiresAt), SESSION_TTL_SECONDS);
    return response.status(204).end();
  }

  if (path === 'auth/session' && request.method === 'GET') {
    return validSession(request)
      ? response.status(204).end()
      : json(response, credentialsConfigured() ? 401 : 503, { error: credentialsConfigured() ? 'Authentication required' : 'CMS authentication is not configured' });
  }

  if (path === 'auth/logout' && request.method === 'POST') {
    setCookie(response, '', 0);
    return response.status(204).end();
  }

  if (path === 'auth/credentials' && request.method === 'PUT') {
    if (!validSession(request)) {
      await notifyAdmin('Unauthorized admin credential change', 'An unauthorized attempt was made to change admin credentials.');
      return json(response, 401, { error: 'Authentication required' });
    }
    const { username, password } = request.body || {};
    if (typeof username !== 'string' || username.trim().length < 3 || typeof password !== 'string' || password.length < 12) return json(response, 400, { error: 'Username must be at least 3 characters and password at least 12 characters' });
    runtimeCredentials.username = username.trim();
    runtimeCredentials.password = password;
    await notifyAdmin('Admin credentials changed', 'Admin credentials were changed successfully.');
    return response.status(204).end();
  }

  if (path === 'auth/forgot-password' && request.method === 'POST') {
    const { username } = request.body || {};
    if (typeof username === 'string' && username.trim() === currentUsername() && mailTransport && process.env.CONTACT_EMAIL) {
      const token = crypto.randomBytes(32).toString('hex');
      resetTokens.set(token, { username: currentUsername(), expiresAt: Date.now() + 15 * 60 * 1000 });
      const baseUrl = process.env.APP_URL || `https://${request.headers.host}`;
      const resetUrl = `${baseUrl.replace(/\/$/, '')}/?adminReset=${encodeURIComponent(token)}`;
      await notifyAdmin('Admin password reset requested', `A password reset was requested.\n\nReset link (expires in 15 minutes):\n${resetUrl}`);
    }
    return json(response, 200, { message: 'If the account exists, a password reset link has been sent to the admin email.' });
  }

  if (path === 'auth/reset-password' && request.method === 'POST') {
    const { token, password } = request.body || {};
    const reset = typeof token === 'string' ? resetTokens.get(token) : undefined;
    if (!reset || reset.expiresAt <= Date.now() || typeof password !== 'string' || password.length < 12) return json(response, 400, { error: 'Invalid or expired password reset request' });
    runtimeCredentials.username = reset.username;
    runtimeCredentials.password = password;
    resetTokens.delete(token);
    await notifyAdmin('Admin password reset completed', 'The admin password was reset successfully.');
    return response.status(204).end();
  }

  return json(response, 404, { error: 'API route not found' });
}
