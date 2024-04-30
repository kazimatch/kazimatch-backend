import { configDotenv } from "dotenv";
configDotenv({
  path: `.env`,
});

const config = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  VERSION: process.env.VERSION,
  DB: {
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  Redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USER,
  },
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRES_IN,
  SMTP: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  SALT: process.env.SALT,
  App: {
    public: process.env.PUBLIC,
    baseUrl:
      process.env.NODE_ENV === "production"
        ? process.env.APP_URL
        : `http://localhost:${process.env.PORT}`,
  },
  Pushy: {
    key: process.env.PUSHY_KEY,
  },
  Mpesa: {
    shortCode: process.env.MPESA_SHORT_CODE,
    baseUrl:
      process.env.NODE_ENV === "production"
        ? process.env.MPESA_BASE_URL_PROD
        : process.env.MPESA_BASE_URL_SANDBOX,
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    passKey: process.env.MPESA_PASS_KEY,
  },
};

export { config };
