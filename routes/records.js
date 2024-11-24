const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Yeni kayıt ekle
router.post('/', async (req, res) => {
    try {
        const { userId, categoryId, amount, description } = req.body;
        const newRecord = new Record({ userId, categoryId, amount, description });
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Kullanıcının tüm kayıtlarını getir
router.get('/:userId', async (req, res) => {
    try {
        const records = await Record.find({ userId: req.params.userId }).populate('categoryId');
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
