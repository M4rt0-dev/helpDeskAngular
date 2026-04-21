import DOMPurify from 'dompurify';

/**
 * Módulo de Seguridad - OWASP Top 10 2025 Compliance
 * Implementa medidas de seguridad para proteger contra vulnerabilidades comunes
 */

// A02:2021 - Cryptographic Failures
// Hashear contraseñas usando Web Crypto API con SHA-256
export async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Error al hashear contraseña:', error);
    throw new Error('Error en el sistema de seguridad');
  }
}

// A02:2021 - Cryptographic Failures
// Verificar contraseña contra hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
  } catch (error) {
    console.error('Error al verificar contraseña:', error);
    return false;
  }
}

// A03:2021 - Injection (XSS Protection)
// Sanitizar HTML para prevenir XSS
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href']
  });
}

// A03:2021 - Injection
// Sanitizar input de texto plano
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  // Remover caracteres peligrosos
  return input
    .trim()
    .replace(/[<>]/g, '') // Prevenir XSS básico
    .replace(/javascript:/gi, '') // Prevenir javascript: URLs
    .replace(/on\w+\s*=/gi, ''); // Prevenir event handlers
}

// A03:2021 - Injection
// Validar formato de username (solo caracteres seguros)
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

// A03:2021 - Injection
// Validar formato de email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// A01:2021 - Broken Access Control
// Verificar permisos de usuario
export function hasPermission(
  userRole: 'admin' | 'tecnico' | 'usuario',
  requiredRole: 'admin' | 'tecnico' | 'usuario'
): boolean {
  const roleHierarchy = {
    admin: 3,
    tecnico: 2,
    usuario: 1
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// A01:2021 - Broken Access Control
// Generar token de sesión seguro
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// A08:2021 - Software and Data Integrity Failures
// Generar checksum para verificar integridad de datos
export async function generateChecksum(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error al generar checksum:', error);
    return '';
  }
}

// A08:2021 - Software and Data Integrity Failures
// Verificar integridad de datos
export async function verifyIntegrity(data: string, expectedChecksum: string): Promise<boolean> {
  try {
    const actualChecksum = await generateChecksum(data);
    return actualChecksum === expectedChecksum;
  } catch (error) {
    console.error('Error al verificar integridad:', error);
    return false;
  }
}

// A07:2021 - Identification and Authentication Failures
// Rate limiting para prevenir brute force
interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 900000
): {
  allowed: boolean;
  remainingAttempts: number;
  blockedUntil?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Si está bloqueado, verificar si ya expiró el bloqueo
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: entry.blockedUntil
    };
  }

  // Si no hay entrada o la ventana expiró, reiniciar
  if (!entry || now - entry.lastAttempt > windowMs) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      lastAttempt: now
    });
    return {
      allowed: true,
      remainingAttempts: maxAttempts - 1
    };
  }

  // Incrementar intentos
  entry.attempts += 1;
  entry.lastAttempt = now;

  // Si excede el límite, bloquear
  if (entry.attempts > maxAttempts) {
    entry.blockedUntil = now + windowMs;
    rateLimitStore.set(identifier, entry);
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: entry.blockedUntil
    };
  }

  rateLimitStore.set(identifier, entry);
  return {
    allowed: true,
    remainingAttempts: maxAttempts - entry.attempts
  };
}

// A07:2021 - Identification and Authentication Failures
// Resetear rate limit (para login exitoso)
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

// A09:2021 - Security Logging and Monitoring Failures
// Interfaz para logs de auditoría de seguridad
export interface SecurityLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  event: string;
  user?: string;
  ip?: string;
  details?: Record<string, unknown>;
}

// A09:2021 - Security Logging and Monitoring Failures
// Registrar evento de seguridad
export function logSecurityEvent(log: Omit<SecurityLog, 'timestamp'>): void {
  const securityLog: SecurityLog = {
    timestamp: new Date().toISOString(),
    ...log
  };

  // En producción, esto se enviaría a un servidor de logs
  // Por ahora, lo guardamos en localStorage con límite
  try {
    const logs = JSON.parse(localStorage.getItem('helpdesk_security_logs') || '[]');
    logs.push(securityLog);

    // Mantener solo los últimos 1000 logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }

    localStorage.setItem('helpdesk_security_logs', JSON.stringify(logs));

    // Log crítico también en consola
    if (log.level === 'critical' || log.level === 'error') {
      console.error('[SECURITY]', securityLog);
    } else if (log.level === 'warning') {
      console.warn('[SECURITY]', securityLog);
    }
  } catch (error) {
    console.error('Error al registrar log de seguridad:', error);
  }
}

// A07:2021 - Identification and Authentication Failures
// Verificar si la sesión ha expirado
export function isSessionExpired(sessionTimestamp: number, maxAgeMs: number = 28800000): boolean {
  // Por defecto 8 horas (28800000 ms)
  return Date.now() - sessionTimestamp > maxAgeMs;
}

// A05:2021 - Security Misconfiguration
// Validar configuración de seguridad
export function validateSecurityConfig(): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Verificar que estamos en HTTPS en producción
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    issues.push('La aplicación debe ejecutarse sobre HTTPS en producción');
  }

  // Verificar soporte de Web Crypto API
  if (!window.crypto || !window.crypto.subtle) {
    issues.push('Web Crypto API no disponible - funciones de seguridad limitadas');
  }

  // Verificar localStorage disponible
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  } catch (e) {
    issues.push('localStorage no disponible - no se pueden guardar sesiones');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

// A04:2021 - Insecure Design
// Validar fortaleza de contraseña
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 0;

  // Longitud mínima
  if (password.length < 8) {
    issues.push('La contraseña debe tener al menos 8 caracteres');
  } else if (password.length >= 8) {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Mayúsculas
  if (!/[A-Z]/.test(password)) {
    issues.push('Debe contener al menos una letra mayúscula');
  } else {
    score += 1;
  }

  // Minúsculas
  if (!/[a-z]/.test(password)) {
    issues.push('Debe contener al menos una letra minúscula');
  } else {
    score += 1;
  }

  // Números
  if (!/\d/.test(password)) {
    issues.push('Debe contener al menos un número');
  } else {
    score += 1;
  }

  // Caracteres especiales
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push('Debe contener al menos un carácter especial');
  } else {
    score += 1;
  }

  return {
    valid: issues.length === 0,
    score,
    issues
  };
}
