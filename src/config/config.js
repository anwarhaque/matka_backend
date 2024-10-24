require("dotenv").config();

module.exports = {
  MERCHANT_ID: process.env.MERCHANT_ID,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_OPTIONS: {
    origin: process.env.ORIGIN, // Allow only this domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'authkey', 'token'], // Allowed headers
    credentials: true, // Allow credentials (e.g., cookies)
  }
};
