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
