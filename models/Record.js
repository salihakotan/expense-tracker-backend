const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },//-
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },//-
    //test: 
     category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },//-
    title: { type: String, required: true },
    createdAt: { type: String, required: false }, //-
    updatedAt: { type: String, required: false },//-

}, { timestamps: true });


// _id yerine id kullanılması için toJSON/toObject özelleştirme
RecordSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id; // _id'yi id olarak kopyala
        delete ret._id; // _id'yi kaldır
        delete ret.__v; // __v'yi kaldır (isteğe bağlı)
    }
});

RecordSchema.set('toObject', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


module.exports = mongoose.model('Record', RecordSchema);
