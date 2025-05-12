import rateLimit from "express-rate-limit";

const authLimit = rateLimit({
  windowMs:  15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    const ip = req.headers["x-forwarded-for"] || req.ip;
    return ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "TOO MANY REQUESTS , PLEASE TRY AGIAN LATER",
    });
  },
});

export default authLimit;
