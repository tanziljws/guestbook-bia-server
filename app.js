const cors = require('cors');
const corsOptions = require('./src/config/corsOption');
const express = require('express');
const siswaRoutes = require('./src/routes/siswaRoute');
const umumRoutes = require('./src/routes/umumRoute');

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/siswa', siswaRoutes);
app.use('/api/umum', umumRoutes);

module.exports = app;
