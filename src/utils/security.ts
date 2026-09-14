/**
 * Security & Hardening Utilities
 * Defenses against XSS, Prototype Pollution, Insecure Direct Links,
 * Brute-Force, and Malicious Payloads.
 */

// Safe protocol whitelist
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Sanitizes URLs to prevent DOM XSS and malicious protocol injection (e.g. javascript:, data:, vbscript:)
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Allow anchor links on current page (e.g. #projects, #contact)
  if (trimmed.startsWith('#')) {
    // Only allow alphanumeric anchor names plus dash and underscore
    if (/^#[a-zA-Z0-9\-_]+$/.test(trimmed)) {
      return trimmed;
    }
    return '#';
  }

  // Handle mailto and tel
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    const scheme = trimmed.split(':')[0] + ':';
    if (ALLOWED_PROTOCOLS.has(scheme)) {
      // Basic character check
      return trimmed.replace(/["'<>\\]/g, '');
    }
    return '#';
  }

  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      console.warn(`[Security Guard] Blocked potentially unsafe URL protocol: ${parsed.protocol}`);
      return '#';
    }
    return parsed.href;
  } catch {
    // If it's a relative URL or cannot be parsed
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return trimmed.replace(/["'<>\\]/g, '');
    }
    // Block anything else that doesn't parse cleanly
    return '#';
  }
}

/** Allows the locally uploaded PDF format used by the resume viewer. */
export function sanitizePdfUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (/^data:application\/pdf;base64,[A-Za-z0-9+/]+={0,2}$/.test(trimmed)) {
    return trimmed;
  }
  return sanitizeUrl(trimmed);
}

/**
 * Strips HTML tags and controls characters to prevent markup injection
 */
export function sanitizeText(text?: string | null, maxLength = 2000): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .slice(0, maxLength)
    .replace(/\0/g, '') // remove null bytes
    .replace(/<[^>]*>/g, '') // strip any accidental raw HTML tags
    .trim();
}

/**
 * Computes SHA-256 hash using Web Crypto API
 */
export async function computeSha256(message: string): Promise<string> {
  if (window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback pure-JS deterministic hash if subtle is unavailable
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `fallback_${Math.abs(hash).toString(16)}`;
}

/**
 * Prototype pollution protection for JSON data
 * Recursively cleans object keys, removing __proto__, constructor, and prototype
 */
export function deepSanitizeObject<T>(obj: T, depth = 0): T {
  if (depth > 10 || obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepSanitizeObject(item, depth + 1)) as unknown as T;
  }

  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    // Block Prototype Pollution vectors
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      console.warn(`[Security Guard] Blocked prototype pollution key: ${key}`);
      continue;
    }
    if (typeof value === 'string') {
      cleanObj[key] = sanitizeText(value, 5000);
    } else if (typeof value === 'object' && value !== null) {
      cleanObj[key] = deepSanitizeObject(value, depth + 1);
    } else {
      cleanObj[key] = value;
    }
  }

  return cleanObj as T;
}

/**
 * Security Event Types for SOC Audit Log
 */
export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  type: 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'BRUTE_FORCE_BLOCKED' | 'PASSWORD_CHANGED' | 'UNAUTHORIZED_MUTATION' | 'DATA_BACKUP' | 'DATA_RESTORED';
  details: string;
  severity: 'low' | 'medium' | 'high';
}

const AUDIT_LOG_KEY = 'soc_security_audit_log_v1';
const MAX_LOG_ENTRIES = 50;

export function logSecurityEvent(
  type: SecurityAuditEntry['type'],
  details: string,
  severity: SecurityAuditEntry['severity'] = 'low'
) {
  try {
    const current = getSecurityLogs();
    const entry: SecurityAuditEntry = {
      id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      details,
      severity
    };
    const updated = [entry, ...current].slice(0, MAX_LOG_ENTRIES);
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to log security event', e);
  }
}

export function getSecurityLogs(): SecurityAuditEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearSecurityLogs() {
  try {
    localStorage.removeItem(AUDIT_LOG_KEY);
  } catch (e) {
    console.error('Failed to clear security logs', e);
  }
}
