/**
 * FieldRoot Connect — Security Middleware Suite
 * Provides rate limiting, NoSQL injection prevention, XSS input sanitization,
 * MongoDB ObjectId validation, and security audit logging.
 */

const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// In-memory security audit log ring buffer (last 100 events)
const securityAuditLogs = [];
const MAX_AUDIT_LOGS = 100;

const logSecurityEvent = (eventType, details, req) => {
  const ip = req?.headers ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown') : (req?.ip || 'internal');
  const entry = {
    id: 'SEC-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    eventType,
    ip: typeof ip === 'string' ? ip.split(',')[0].trim() : 'unknown',
    method: req ? req.method : '',
    url: req ? req.originalUrl : '',
    userId: req?.user ? req.user.id : null,
    details
  };

  securityAuditLogs.unshift(entry);
  if (securityAuditLogs.length > MAX_AUDIT_LOGS) {
    securityAuditLogs.pop();
  }

  if (process.env.NODE_ENV !== 'test') {
    console.warn(`🔒 [SECURITY AUDIT] ${eventType} | IP: ${entry.ip} | ${details}`);
  }
};

/**
 * 1. General API Rate Limiter
 * 300 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  },
  handler: (req, res, next, options) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', 'General API rate limit reached', req);
    res.status(429).json(options.message);
  }
});

/**
 * 2. Strict Auth Rate Limiter
 * 15 login/register attempts per 15 minutes per IP to block credential stuffing and brute force
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many authentication attempts. For your security, this IP has been temporarily throttled. Please try again in 15 minutes.'
  },
  handler: (req, res, next, options) => {
    logSecurityEvent('AUTH_BRUTE_FORCE_THROTTLED', `Phone attempted: ${req.body?.phone || 'unknown'}`, req);
    res.status(429).json(options.message);
  }
});

/**
 * 3. NoSQL Injection Prevention
 * Strips MongoDB operators ($ and .) from request inputs
 */
const noSqlSanitizer = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logSecurityEvent('NOSQL_INJECTION_DETECTED', `Sanitized key '${key}' in request`, req);
  }
});

/**
 * 4. XSS & Dangerous HTML Stripper
 * Recursively cleans user inputs from malicious script tags, iframes, and javascript: URIs
 */
const cleanString = (val) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove <iframe> tags
    .replace(/javascript:/gi, '')                                      // Remove javascript: pseudo-protocols
    .replace(/on\w+\s*=/gi, '');                                        // Remove inline event handlers like onerror=
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      obj[key] = cleanString(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
};

const xssSanitizer = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};

/**
 * 5. MongoDB ObjectId Parameter Validator
 * Rejects malformed hex strings before hitting Mongoose database queries
 */
const validateObjectId = (paramName = 'id') => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !objectIdPattern.test(id)) {
      logSecurityEvent('INVALID_OBJECT_ID', `Invalid ID format received: ${id}`, req);
      return res.status(400).json({
        success: false,
        message: `Invalid identifier parameter format: '${id}'`
      });
    }
    next();
  };
};

module.exports = {
  apiLimiter,
  authLimiter,
  noSqlSanitizer,
  xssSanitizer,
  validateObjectId,
  logSecurityEvent,
  getSecurityAuditLogs: () => [...securityAuditLogs]
};
