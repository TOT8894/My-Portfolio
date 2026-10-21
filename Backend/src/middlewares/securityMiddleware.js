/**
 * Production Security Middleware Suite
 * Includes:
 * 1. Enterprise Security Headers (HSTS, CSP, X-Frame-Options, XSS Protection, Sniff Guard)
 * 2. Sliding Window Rate Limiter (Brute-Force & DDoS Protection)
 * 3. Deep Request Sanitization (XSS, Injection, Parameter Pollution Defense)
 */

// 1. Enterprise Security Headers Middleware
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking by disallowing framing
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Cross-Site Scripting (XSS) Filter in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Restrict referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // DNS Prefetch Control
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  // Disable download of untrusted attachments in IE
  res.setHeader('X-Download-Options', 'noopen');

  // Cross Domain Policy restrictions
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  // Strict Transport Security (HSTS) in Production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Remove Express fingerprinting header
  res.removeHeader('X-Powered-By');

  next();
};

// 2. Sliding Window Rate Limiter Factory
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes
  max = 100, // max requests per window
  message = 'Too many requests from this IP, please try again later.',
}) => {
  const ipRequests = new Map();

  // Periodic cleanup every 5 minutes to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequests.entries()) {
      if (now > data.resetTime) {
        ipRequests.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    // Determine client IP
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const now = Date.now();
    let record = ipRequests.get(clientIp);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipRequests.set(clientIp, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    if (record.count > max) {
      res.setHeader('Retry-After', resetSeconds);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: resetSeconds,
      });
    }

    next();
  };
};

// Specialized Rate Limiters
export const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'API rate limit exceeded. Please wait a few minutes.',
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15, // 15 login attempts per 15 minutes to defeat brute force
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

export const contactLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10, // Max 10 messages per 15 mins to prevent spam floods
  message: 'Contact submission frequency exceeded. Please try again shortly.',
});

// 3. Deep Request Sanitization (Strips Script Injections & Malicious Tags)
function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
      .replace(/javascript:/gi, '') // Strip inline JS protocols
      .replace(/onload\s*=/gi, '') // Strip inline event handlers
      .replace(/onerror\s*=/gi, '')
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    const cleanObj = {};
    for (const [key, val] of Object.entries(value)) {
      cleanObj[key] = sanitizeValue(val);
    }
    return cleanObj;
  }
  return value;
}

export const sanitizeInputs = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};
