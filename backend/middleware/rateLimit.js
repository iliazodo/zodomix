import rateLimit from "express-rate-limit";

export const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Get the real IP address from the x-forwarded-for header
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      // The first IP in the chain is the real client IP
      return forwarded.split(',')[0]; 
    }
    return req.ip;  // Fallback to req.ip if no forwarded header is present
  },
  handler: (req, res) => {
    console.log("Rate limit triggered from IP:", req.ip);  // You can still log the original IP from req.ip
    res.status(429).json({
      error: "TOO MANY REQUESTS, PLEASE TRY AGAIN LATER",
    });
  },
});

export const messageLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: "TOO MANY MESSAGES SENT, PLEASE TRY 1MIN LATER",
    });
  },
});
