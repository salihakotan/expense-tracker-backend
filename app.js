const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Çevresel değişkenleri yükle
dotenv.config();

// Express uygulaması
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
const connectDB = require('./config/database');
connectDB();

// Rotalar
app.use('/api/users', require('./routes/users'));
app.use('/api/records', require('./routes/records'));
app.use('/api/categories', require('./routes/categories'));

// Sunucu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
