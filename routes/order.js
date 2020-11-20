const express = require('express');
const router = express.Router();
const moment = require('moment');

const OrderModel = require('../model/order');
const SettlementModel = require('../model/settlement');

router.get('/list', async (req, res) => {
    const { limit = 20, offset = 0, type = 0 } = req.query;
    const where = { };
    switch(+type) {
        case 1: // 本日结算
            where.settlementId = { $eq: -1 };
            const settlement = await SettlementModel.findOne({ 
                $and: [
                    { date: { $gte: moment().startOf('d').toDate() }}, 
                    { date: { $lt: moment().endOf('d').toDate() }}
                ],
            }).exec();
            if (settlement) {
                where.settlementId = { $eq: settlement._id };
            }
            break;
        case 2: // 本日未结算
            where.settlementId = { $eq: null };
            break;
    }
    const orders = await OrderModel.find(where).limit(+limit).skip(+offset).exec();
    const total = await OrderModel.count(where).exec();
    return res.send({ rows: orders, total: total });
});

router.post('/settlement', async (req, res) => {
    let settlement = await SettlementModel.findOne({ 
        $and: [
            { date: { $gte: moment().startOf('d').toDate() }}, 
            { date: { $lt: moment().endOf('d').toDate() }}
        ],
    }).exec();
    if (!settlement) {
        settlement = new SettlementModel();
        await settlement.save();
    }

    const where = { settlementId: { $eq: null } };
    const total = await OrderModel.count(where).exec();
    const updateResult = await OrderModel.updateMany(where, { settlementId: settlement._id }).exec();
    return res.send({ actualCount: updateResult.n, expectCount: total });
});

router.get('/statistics', async (req, res) => {
    const settlement = await SettlementModel.findOne({ 
            $and: [
                { date: { $gte: moment().startOf('d').toDate() }}, 
                { date: { $lt: moment().endOf('d').toDate() }}
            ],
        })
        .exec();

    if (!settlement) {
        return res.send({ rows: [], total: 0 });
    }

    const orders = await OrderModel.aggregate()
        .group({ _id: '$itemName', price: { $sum: '$price' } })
        .exec();

});

module.exports = router;