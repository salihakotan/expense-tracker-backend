const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Yeni kategori oluştur
router.post('/', async (req, res) => {
    try {
        const { name, type, color } = req.body;
        const newCategory = new Category({ name, type, color });
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

// Kategori güncelle
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, color } = req.body;

        // Kategoriyi ID'ye göre bul ve güncelle
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, type, color },
            { new: true } // Güncellenmiş belgeyi döndür
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Kategori bulunamadı.' });
        }

        res.json(updatedCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Kategori sil
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Kategoriyi ID'ye göre sil
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Kategori bulunamadı.' });
        }

        res.json({ message: 'Kategori başarıyla silindi.', deletedCategory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
