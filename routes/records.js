const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Yeni kayıt ekle
router.post('/', async (req, res) => {
    try {
        const { title, amount, category_id } = req.body;

        // Eksik parametre kontrolü
        if (!category_id) {
            return res.status(400).json({ error: 'Category bilgisi eksik!' });
        }

        // Yeni kayıt oluştur
        const newRecord = new Record({
            title,
            amount,
            category_id,
        });

        await newRecord.save();

        // Kayıt bilgilerini doldur
        const populatedRecord = await Record.findById(newRecord._id).populate({
            path: 'category_id',
            select: 'name color', // Gerekli alanları seç
        });

        res.status(201).json({
            ...populatedRecord.toObject(),
            category: populatedRecord.category_id,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Kullanıcının tüm kayıtlarını getir
router.get('/:userId', async (req, res) => {
    try {
        const records = await Record.find({ userId: req.params.userId }).populate({
            path: 'category_id',
            select: 'name color',
        });

        // category_id'den category alanını doldur
        const result = records.map((record) => ({
            ...record.toObject(),
            category: record.category_id,
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tüm kayıtları getir
router.get('/', async (req, res) => {
    try {
        const records = await Record.find().populate({
            path: 'category_id',
            select: 'name color',
        }).sort({ updatedAt: -1 });

        // category_id'den category alanını doldur
        const result = records.map((record) => ({
            ...record.toObject(),
            category: record.category_id,
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Kayıt güncelle
router.put('/:id', async (req, res) => {
    try {
        const { title, amount, category_id } = req.body;

        const updatedRecord = await Record.findByIdAndUpdate(
            req.params.id,
            { title, amount, category_id },
            { new: true } // Güncellenmiş belgeyi döndür
        ).populate({
            path: 'category_id',
            select: 'name color',
        });

        if (!updatedRecord) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({
            ...updatedRecord.toObject(),
            category: updatedRecord.category_id,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Kayıt silme
router.delete('/:id', async (req, res) => {
    try {
        const record = await Record.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
