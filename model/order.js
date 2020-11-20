const { Schema, model } = require('mongoose');

module.exports = model('Order', new Schema({
    orderName: String,
    originName: String,
    date: { type: Date, default: Date.now() },
    name: String,
    price: Number,
    userId: String,
}));