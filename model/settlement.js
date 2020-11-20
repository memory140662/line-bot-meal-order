const { Schema, model } = require('mongoose');

module.exports = model('Settlement', new Schema({
    date: { type: Date, default: Date.now() },
}));