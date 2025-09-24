const express = require('express');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} in ${NODE_ENV} mode`);
});
