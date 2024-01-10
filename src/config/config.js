import { configDotenv } from "dotenv";
configDotenv({
    path: `.env.development`
});

const config = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    GEOFENCE: {
        url: process.env.GEOFENCE,
        user: process.env.GEOFENCE + '/users',
        group: process.env.GEOFENCE + '/groups',
        rule: process.env.GEOFENCE + '/rules',
        instance: process.env.GEOFENCE + '/instances',
        adminRule: process.env.GEOFENCE + '/adminrules',
        batch: process.env.GEOFENCE + '/batch/exec',
    },
    VERSION: process.env.VERSION,
    DB: {
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    },
    Redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASS
    },
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRES_IN,
    SMTP: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    },
    SALT: process.env.SALT,
    App: {
        baseUrl: process.env.APP_URL
    },
};

export {
    config
}
