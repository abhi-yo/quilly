import crypto from 'crypto';
import { headers } from 'next/headers';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  score: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  resetTime: number;
}

const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon'
];

const SUSPICIOUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /expression\s*\(/gi,
  /vbscript:/gi,
  /data:text\/html/gi
];

export class SecurityValidator {
  static validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    } else if (password.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    } else {
      score += 1;
    }

    if (/(.)\1{2,}/.test(password)) {
      errors.push("Password cannot contain repeating characters");
      score -= 1;
    }

    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
      errors.push("Password is too common");
      score -= 2;
    }

    if (password.toLowerCase().includes('password')) {
      errors.push("Password cannot contain the word 'password'");
      score -= 1;
    }

    const entropy = this.calculateEntropy(password);
    if (entropy < 3.0) {
      errors.push("Password is not complex enough");
      score -= 1;
    } else if (entropy > 4.0) {
      score += 1;
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: Math.max(0, Math.min(10, score))
    };
  }

  static calculateEntropy(password: string): number {
    const charFreq: { [key: string]: number } = {};
    for (const char of password) {
      charFreq[char] = (charFreq[char] || 0) + 1;
    }

    let entropy = 0;
    const length = password.length;
    for (const freq of Object.values(charFreq)) {
      const p = freq / length;
      entropy -= p * Math.log2(p);
    }

    return entropy;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) return false;
    if (email.length > 254) return false;
    if (email.includes('..')) return false;
    if (email.startsWith('.') || email.endsWith('.')) return false;

    const [localPart, domain] = email.split('@');
    if (localPart.length > 64) return false;

    const suspiciousDomains = [
      'tempmail.com', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'temp-mail.org'
    ];
    
    return !suspiciousDomains.some(suspDomain => domain.includes(suspDomain));
  }

  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>'"&]/g, (char) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[char] || char;
      })
      .substring(0, 1000);
  }

  static detectXSS(input: string): boolean {
    return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(input));
  }

  static validateName(name: string): { isValid: boolean; error?: string } {
    if (!name || name.length < 2) {
      return { isValid: false, error: "Name must be at least 2 characters long" };
    }
    
    if (name.length > 50) {
      return { isValid: false, error: "Name cannot exceed 50 characters" };
    }

    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return { isValid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
    }

    if (this.detectXSS(name)) {
      return { isValid: false, error: "Invalid characters detected" };
    }

    return { isValid: true };
  }

  static generateSecureOTP(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return crypto.randomInt(min, max).toString();
  }

  static generateSecureToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }

  static hashPassword(password: string, rounds: number = 14): Promise<string> {
    const bcrypt = require('bcryptjs');
    return bcrypt.hash(password, rounds);
  }

  static comparePassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, hash);
  }
}

export class RateLimiter {
  private static instances = new Map<string, Map<string, { count: number; resetTime: number }>>();

  static check(
    identifier: string,
    maxRequests: number,
    windowMs: number,
    key: string = 'default'
  ): RateLimitResult {
    if (!this.instances.has(key)) {
      this.instances.set(key, new Map());
    }

    const store = this.instances.get(key)!;
    const now = Date.now();
    const windowStart = now - windowMs;

    const userRequests = store.get(identifier);
    
    if (!userRequests || userRequests.resetTime <= now) {
      store.set(identifier, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remainingRequests: maxRequests - 1, resetTime: now + windowMs };
    }

    if (userRequests.count >= maxRequests) {
      return { 
        allowed: false, 
        remainingRequests: 0, 
        resetTime: userRequests.resetTime 
      };
    }

    userRequests.count++;
    return { 
      allowed: true, 
      remainingRequests: maxRequests - userRequests.count, 
      resetTime: userRequests.resetTime 
    };
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, store] of this.instances) {
      for (const [identifier, data] of store) {
        if (data.resetTime <= now) {
          store.delete(identifier);
        }
      }
    }
  }
}

export function getClientIP(): string {
  const headersList = headers();
  const forwarded = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  const cfConnectingIP = headersList.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  return 'unknown';
}

export function createSecureSession(userId: string, additionalData: any = {}): string {
  const sessionData = {
    userId,
    createdAt: Date.now(),
    ...additionalData
  };
  
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  return sessionToken;
}

export function validateCSRFToken(providedToken: string, expectedToken: string): boolean {
  if (!providedToken || !expectedToken) return false;
  
  return crypto.timingSafeEqual(
    Buffer.from(providedToken, 'hex'),
    Buffer.from(expectedToken, 'hex')
  );
}

setInterval(() => {
  RateLimiter.cleanup();
}, 5 * 60 * 1000); 