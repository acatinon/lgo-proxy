'use strict';

const WebSocket = require('ws');

const productId = process.env.PRODUCT_ID || 'BTC-USD';

const socket = new WebSocket('ws://localhost:3002');

const context = { lastBatchTime: new Date() };

socket.on('message', m => {
  const message = JSON.parse(m);
  const now = new Date();
  const duration = now - context.lastBatchTime;
  context.lastBatchTime = now;
  if (message.type === 'update') {
    console.log(`Batch #${message.batch_id} (+${duration}ms)\u0007`);
  }
});

socket.on('error', console.error);

socket.on('open', socketOpen);

function socketOpen() {
  const message = {
    type: 'subscribe',
    channels: [
      {
        name: 'trades',
        product_id: productId
      }
    ]
  };
  socket.send(JSON.stringify(message), messageSent);
}

function messageSent(error) {
  if (error) {
    console.error('Message cannot be sent', error);
  }
}
