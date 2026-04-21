// Security and utility functions

// Hash password using a simple approach (for development only)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
async function verifyPassword(password, hash) {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

// Sanitize input to prevent injection attacks
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>\"'&]/g, char => {
    const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
    return map[char];
  });
}

// Sanitize HTML
function sanitizeHTML(html) {
  if (typeof html !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Validate username
function validateUsername(username) {
  return /^[a-z0-9_]{3,20}$/.test(username);
}

// Validate password strength
function validatePasswordStrength(password) {
  const rules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password)
  };
  return { strength: Object.values(rules).filter(Boolean).length, rules };
}

// Rate limiting
const rateLimitMap = {};
function checkRateLimit(key, maxAttempts, windowMs) {
  const now = Date.now();
  if (!rateLimitMap[key]) {
    rateLimitMap[key] = [];
  }
  
  const attempts = rateLimitMap[key].filter(time => now - time < windowMs);
  rateLimitMap[key] = attempts;
  
  if (attempts.length >= maxAttempts) {
    return {
      allowed: false,
      blockedUntil: attempts[0] + windowMs
    };
  }
  
  rateLimitMap[key].push(now);
  return { allowed: true };
}

function resetRateLimit(key) {
  delete rateLimitMap[key];
}

// Security event logging
function logSecurityEvent(event) {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY ${timestamp}]`, event);
  
  // Could send to backend here
  try {
    const events = JSON.parse(localStorage.getItem('security_events') || '[]');
    events.push({ ...event, timestamp });
    localStorage.setItem('security_events', JSON.stringify(events.slice(-100)));
  } catch (e) {
    console.error('Error logging security event', e);
  }
}

// Session management
function isSessionExpired(sessionTimestamp) {
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  return Date.now() - sessionTimestamp > SESSION_TIMEOUT_MS;
}

// Validate security config
function validateSecurityConfig() {
  const issues = [];
  
  // Check if running over HTTPS (in production)
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    issues.push('Application should be served over HTTPS in production');
  }
  
  // Check if localStorage is available
  try {
    localStorage.setItem('__test__', '1');
    localStorage.removeItem('__test__');
  } catch (e) {
    issues.push('localStorage is not available');
  }
  
  // Check if crypto API is available
  if (!window.crypto || !window.crypto.subtle) {
    issues.push('Web Crypto API is not available');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// Generate session token
function generateSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
