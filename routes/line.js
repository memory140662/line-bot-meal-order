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
    console.log('***************************** handle event starting!');
    console.log(JSON.stringify(event.message, undefined, 2));
    if (event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    const text = event.message.text;
    
    if (_.startsWith(text, '#')) {
      const userId = event.source.userId;
      const user = await client.getProfile(userId);
      const originName = user.displayName;
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
    const result = await client.replyMessage(event.replyToken, { type: 'text', text: event.message.text });
    return result;
}

module.exports = router;