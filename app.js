const cors = require('cors');
const corsOptions = require('./src/config/corsOption');
const express = require('express');
const helmet = require('helmet');
const umumRoutes = require('./src/routes/umumRoute');

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use('/api/umum', umumRoutes);

module.exports = app;
