const express = require('express');
const router = express.Router();
const line = require('@line/bot-sdk');
const _ = require('lodash');
const OrderModel = require('../model/order');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
}

const client = new line.Client(config);

router.post('/callback', line.middleware(config), async (req, res) => {
    try {
        const result = await Promise.all(req.body.events.map(handleEvent));
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
});

async function handleEvent(event) {
    console.log('***************************** handle event starting!');
    console.log(JSON.stringify(event.message, undefined, 2));
    if (event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    const text = event.message.text;
    
    if (_.startsWith(text, '#')) {
      const userId = event.source.userId;
      const user = await client.getProfile(userId);
      const displayUserName = user.displayName;
      const [userName, itemName, price] = _.chain(text).replace('#', '').split(/[, ._]+/i).value();
      const order = new OrderModel({
        userName,
        itemName,
        price,
        displayUserName,
        userId,
      });
      await order.save();
    }
    
    return { type: 'text', text: event.message.text };
}

module.exports = router;