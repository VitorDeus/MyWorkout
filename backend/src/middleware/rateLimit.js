/**
 * Simple rate limiting middleware
 * Tracks requests per IP address to prevent abuse
 */

const requestCounts = new Map();

// Clean up old entries every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key, data] of requestCounts.entries()) {
    if (data.resetTime < oneHourAgo) {
      requestCounts.delete(key);
    }
  }
}, 60 * 60 * 1000);

/**
 * Rate limiting middleware
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 */
export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(key)) {
      requestCounts.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    const data = requestCounts.get(key);

    // Reset if window has passed
    if (now > data.resetTime) {
      data.count = 1;
      data.resetTime = now + windowMs;
      return next();
    }

    // Increment count
    data.count++;

    // Check if limit exceeded
    if (data.count > maxRequests) {
      const retryAfter = Math.ceil((data.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.',
        retryAfter
      });
    }

    next();
  };
};

/**
 * Strict rate limit for auth endpoints
 * 5 requests per 15 minutes
 */
export const authRateLimit = rateLimit(5, 15 * 60 * 1000);

/**
 * Moderate rate limit for AI endpoints (premium feature)
 * 20 requests per hour
 */
export const aiRateLimit = rateLimit(20, 60 * 60 * 1000);

/**
 * Standard rate limit for general API endpoints
 * 100 requests per 15 minutes
 */
export const apiRateLimit = rateLimit(100, 15 * 60 * 1000);
