const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret (Daha güvenli bir kullanım için .env dosyasına taşıyın)
const JWT_SECRET = 'mysecretkey';
router.post('/register', async (req, res) => {
    try {
        const { full_name, email, password, username } = req.body;

        // Aynı email veya kullanıcı adına sahip kullanıcı kontrolü
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'e-posta adresi veya kullanıcı adı zaten kullanılıyor.' });
        }

        // Şifreyi hash'le
        const saltRounds = 10; // Güçlü hash için tavsiye edilen salt sayısı
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Yeni kullanıcı oluştur ve kaydet
        const newUser = new User({
            full_name,
            email,
            password: hashedPassword, // Hash'lenmiş şifreyi kaydedin
            username
        });

        await newUser.save();
        res.status(201).json({ message: "Kayıt başarılı!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Tüm kullanıcıları getir (örnek için)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Kullanıcı girişi (Login)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kullanıcıyı e-posta ile bul
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }

        // Şifre kontrolü
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Geçersiz şifre.' });
        }

        // JWT Token oluştur
        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' } // Token geçerlilik süresi
        );

        res.status(200).json({
            message: 'Giriş başarılı.',
            username:user.username,
            email:user.email,
            full_name:user.full_name,
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
