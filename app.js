const cors = require('cors');
const corsOptions = require('./src/config/corsOption');
const express = require('express');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const siswaRoutes = require('./src/routes/siswaRoute');
const umumRoutes = require('./src/routes/umumRoute');

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use('/api/siswa', siswaRoutes);
app.use('/api/umum', umumRoutes);

function imageOnly(req, res, next) {
    const ext = path.extname(req.path).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        return res.status(403).json({ error: 'Akses file tidak diizinkan' });
    }
    next();
}

app.use('/uploads/siswa', imageOnly, express.static(path.join(__dirname, 'uploads/siswa')));

// Catch-all route for debugging
app.use((req, res) => {
    console.log(`Unmatched route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Ukuran file terlalu besar. Maksimal 5MB.' });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(500).json({ error: 'Terjadi kesalahan saat upload file.' });
    }
    next();
});

module.exports = app;
