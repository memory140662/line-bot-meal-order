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
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

async function handleEvent(event) {
    if (event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    const text = event.message.text;
    const userId = event.source.userId;
    const user = await client.getProfile(userId);
    const originName = user.displayName;
    
    if (_.startsWith(text, '#')) {
      const [orderName, name, price] = _.chain(text).replace('#', '').split(/[, ._]/i).value();
      const order = new OrderModel({
        orderName,
        name,
        price,
        originName,
        userId,
      });
      await order.save();
    }
    
    return { type: 'text', text: event.message.text };
}

module.exports = router;