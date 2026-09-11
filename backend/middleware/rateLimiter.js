const rateLimit = {};

export const authRateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000;
  
  if (!rateLimit[ip]) {
    rateLimit[ip] = [];
  }
  
  rateLimit[ip] = rateLimit[ip].filter(timestamp => now - timestamp < windowMs);
  
  if (rateLimit[ip].length >= 10) {
    return res.status(429).json({ success: false, error: 'Too many requests, please try again later.' });
  }
  
  rateLimit[ip].push(now);
  next();
};
