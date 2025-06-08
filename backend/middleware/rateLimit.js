import rateLimit from "express-rate-limit";

export const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0]; 
    }
    return req.ip;
  },
  handler: (req, res) => {
    console.log("Rate limit triggered from IP:", req.ip);
    res.status(429).json({
      error: "TOO MANY REQUESTS, PLEASE TRY AGAIN LATER",
    });
  },
});

export const messageLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0]; 
    }
    return req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "TOO MANY MESSAGES SENT, PLEASE TRY 1MIN LATER",
    });
  },
});
