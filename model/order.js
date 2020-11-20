const { Schema, model } = require('mongoose');

module.exports = model('Order', new Schema({
    userName: String,
    displayUserName: String,
    itemName: String,
    price: Number,
    userId: String,
    date: { type: Date, default: Date.now() },
}));