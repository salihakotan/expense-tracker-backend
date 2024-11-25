const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Yeni kategori oluştur
router.post('/', async (req, res) => {
    try {
        const { name,type, color } = req.body;
        const newCategory = new Category({ name,type, color });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tüm kategorileri getir
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) { 
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
