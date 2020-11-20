const express = require('express');
const router = express.Router();
const orderModel = require('../model/order');

router.get('/list', async (req, res) => {
    const { limit = 20, offset = 0 } = req.query;
    const docs = await orderModel.find({}).limit(limit).skip(offset).exec();
    return res.send(docs);
});

module.exports = router;