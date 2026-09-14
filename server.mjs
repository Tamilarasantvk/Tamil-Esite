import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const isProduction = process.env.NODE_ENV === 'production';
const serveDist = isProduction || process.argv.includes('--serve-dist');
const sessionCookie = 'soc_admin_session';
const sessions = new Map();
const loginAttempts = new Map();
const messageAttempts = new Map();
const passwordResetTokens = new Map();

let credentials = process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD
  ? {
    username: process.env.ADMIN_USERNAME,
    passwordHash: hashPassword(process.env.ADMIN_PASSWORD)
  }
  : null;

app.use(express.json({ limit: '100kb' }));

const mailTransport = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
  })
  : null;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  try {
    const [salt, expected] = storedHash.split(':');
    if (!salt || !expected) return false;
    const actual = crypto.scryptSync(password, salt, 64).toString('hex');
    const expectedBuffer = Buffer.from(expected, 'hex');
    const actualBuffer = Buffer.from(actual, 'hex');
    return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    if (index < 0) return ['', ''];
    try {
      return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
    } catch {
      return [part.slice(0, index).trim(), ''];
    }
  }));
}

function requireSession(request, response, next) {
  if (!credentials) return response.status(503).json({ error: 'CMS authentication is not configured' });
  const token = parseCookies(request)[sessionCookie];
  const session = token && sessions.get(token);
  if (!session || Date.now() - session.createdAt > 8 * 60 * 60 * 1000) {
    if (token) sessions.delete(token);
    if (request.path === '/api/auth/credentials') {
      void sendAdminSecurityEmail('Unauthorized admin credential change', `An unauthorized credential-change attempt was rejected from ${clientAddress(request)}.`);
    }
    return response.status(401).json({ error: 'Authentication required' });
  }
  next();
}

function clientAddress(request) {
  return request.ip || request.socket.remoteAddress || 'unknown';
}

async function sendAdminSecurityEmail(subject, text) {
  if (!mailTransport || !process.env.CONTACT_EMAIL) return false;
  try {
    await mailTransport.sendMail({ from: process.env.SMTP_USER, to: process.env.CONTACT_EMAIL, subject, text });
    return true;
  } catch (error) {
    console.error('Admin security email delivery failed:', error);
    return false;
  }
}

app.post('/api/contact', async (request, response) => {
  const address = clientAddress(request);
  const now = Date.now();
  const recentMessages = (messageAttempts.get(address) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recentMessages.length >= 5) return response.status(429).json({ error: 'Too many messages. Please try again later.' });
  const { name, email, subject, message } = request.body || {};
  if (![name, email, message].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || name.length > 100 || email.length > 254 || message.length > 5000) {
    return response.status(400).json({ error: 'Please check your message details.' });
  }
  if (!mailTransport || !process.env.CONTACT_EMAIL) {
    return response.status(503).json({ error: 'Message delivery is not configured yet.' });
  }

  recentMessages.push(now);
  messageAttempts.set(address, recentMessages);

  try {
    await mailTransport.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      replyTo: email.trim(),
      subject: subject?.trim() || 'Portfolio contact message',
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`
    });
    response.status(204).end();
  } catch (error) {
    console.error('Contact message delivery failed:', error);
    response.status(502).json({ error: 'Message delivery failed. Please use the email link instead.' });
  }
});

app.post('/api/auth/login', (request, response) => {
  if (!credentials) return response.status(503).json({ error: 'CMS authentication is not configured' });
  const now = Date.now();
  const address = clientAddress(request);
  const recentAttempts = (loginAttempts.get(address) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recentAttempts.length >= 10) {
    void sendAdminSecurityEmail('Admin login blocked', `Ten or more admin login attempts were blocked from ${address}.`);
    return response.status(429).json({ error: 'Too many login attempts' });
  }
  recentAttempts.push(now);
  loginAttempts.set(address, recentAttempts);

  const { username, password } = request.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || username !== credentials.username || !verifyPassword(password, credentials.passwordHash)) {
    return response.status(401).json({ error: 'Invalid credentials' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { createdAt: now });
  const secureCookie = isProduction && (request.secure || request.get('x-forwarded-proto') === 'https');
  response.setHeader('Set-Cookie', `${sessionCookie}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=28800${secureCookie ? '; Secure' : ''}`);
  response.status(204).end();
});

app.get('/api/auth/session', requireSession, (_request, response) => response.status(204).end());

app.post('/api/auth/logout', (request, response) => {
  const token = parseCookies(request)[sessionCookie];
  if (token) sessions.delete(token);
  const secureCookie = isProduction && (request.secure || request.get('x-forwarded-proto') === 'https');
  response.setHeader('Set-Cookie', `${sessionCookie}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secureCookie ? '; Secure' : ''}`);
  response.status(204).end();
});

app.put('/api/auth/credentials', requireSession, (request, response) => {
  const { username, password } = request.body || {};
  if (typeof username !== 'string' || username.trim().length < 3) return response.status(400).json({ error: 'Username must be at least 3 characters' });
  if (typeof password !== 'string' || password.length < 12) return response.status(400).json({ error: 'Password must be at least 12 characters' });
  credentials = { username: username.trim(), passwordHash: hashPassword(password) };
  sessions.clear();
  void sendAdminSecurityEmail('Admin credentials changed', `Admin credentials were changed from ${clientAddress(request)}.`);
  response.status(204).end();
});

app.post('/api/auth/forgot-password', async (request, response) => {
  const address = clientAddress(request);
  const requestedUsername = typeof request.body?.username === 'string' ? request.body.username.trim() : '';
  const responseBody = { message: 'If the account exists, a password reset link has been sent to the admin email.' };
  if (!credentials || !requestedUsername || requestedUsername !== credentials.username) return response.json(responseBody);
  if (!mailTransport || !process.env.CONTACT_EMAIL) return response.json(responseBody);

  const token = crypto.randomBytes(32).toString('hex');
  passwordResetTokens.set(token, { username: credentials.username, expiresAt: Date.now() + 15 * 60 * 1000 });
  const baseUrl = process.env.APP_URL || `${request.protocol}://${request.get('host')}`;
  const resetUrl = `${baseUrl.replace(/\/$/, '')}/?adminReset=${encodeURIComponent(token)}`;
  await sendAdminSecurityEmail('Admin password reset requested', `A password reset was requested from ${address}.\n\nReset link (expires in 15 minutes):\n${resetUrl}`);
  response.json(responseBody);
});

app.post('/api/auth/reset-password', (request, response) => {
  const { token, password } = request.body || {};
  const reset = typeof token === 'string' ? passwordResetTokens.get(token) : undefined;
  if (!reset || reset.expiresAt <= Date.now() || typeof password !== 'string' || password.length < 12) {
    return response.status(400).json({ error: 'Invalid or expired password reset request' });
  }
  credentials = { username: reset.username, passwordHash: hashPassword(password) };
  passwordResetTokens.delete(token);
  sessions.clear();
  void sendAdminSecurityEmail('Admin password reset completed', `The admin password was reset from ${clientAddress(request)}.`);
  response.status(204).end();
});

if (serveDist) {
  const root = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(root, 'dist')));
  app.get('*', (_request, response) => response.sendFile(path.join(root, 'dist', 'index.html')));
}

app.listen(port, '0.0.0.0', () => console.log(`Portfolio server listening on http://localhost:${port}`));
