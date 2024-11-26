const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, default: '#000000' }, // Renk kodu
}, { timestamps: true });

// _id yerine id kullanılması için toJSON/toObject özelleştirme
CategorySchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id; // _id'yi id olarak kopyala
        delete ret._id; // _id'yi kaldır
        delete ret.__v; // __v'yi kaldır (isteğe bağlı)
    }
});

CategorySchema.set('toObject', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Category', CategorySchema);
