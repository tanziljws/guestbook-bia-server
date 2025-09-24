require('dotenv').config();

const isDev = process.env.NODE_ENV !== 'production';

// Split ALLOWED_ORIGINS (separate with commas if more than one)
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];

const corsOptions = {
    origin: function (origin, callback) {
        // request without origin (for example Postman)
        if (!origin) return callback(null, true);

        if (isDev) {
            // Development: allow all origins
            return callback(null, true);
        }

        // Production: match against whitelist or regex (localhost)
        if (
            allowedOrigins.some((pattern) =>
                typeof pattern === 'string'
                    ? pattern === origin
                    : pattern.test(origin)
            ) ||
            /\.localhost:\d+$/.test(origin)
        ) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions;
