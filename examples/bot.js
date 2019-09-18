'use strict';

const { random, sample } = require('lodash/fp');
const WebSocket = require('ws');
const axios = require('axios');

const orderInterval = Number.parseInt(process.env.DELAY, 10) || 500;
const price = Number.parseFloat(process.env.PRICE) || 3000.1;
const priceDelta = 0.01;

const socket = new WebSocket('ws://localhost:3002');

socket.on('message', console.info);
socket.on('error', console.error);
socket.on('open', socketOpen);

function socketOpen() {
  placeOrderPeriodically();
}

function placeOrderPeriodically() {
  setInterval(placeOrder, orderInterval);
}

async function placeOrder() {
  try {
    const side = sample(['S', 'B']);
    const order = {
      type: 'L',
      side,
      product_id: 'BTC-USD',
      quantity: randomCurrency(0.1, 10.0, 2),
      price: randomCurrency(
        price * (1 - priceDelta),
        price * (1 + priceDelta),
        1
      )
    };
    logOrder(order);
    const encryptedOrder = await prepareOrder(order);
    const message = { type: 'placeorder', order: encryptedOrder };
    socket.send(JSON.stringify(message), messageSent);
  } catch (error) {
    console.error('Cannot place order', error);
  }
}

async function prepareOrder(order) {
  try {
    const response = await axios.post(
      'http://localhost:3002/prepare-order',
      order
    );
    return response.data;
  } catch (error) {
    console.error(
      `Prepare order failed (code: ${error.response.status})`,
      error
    );
  }
}

function logOrder(order) {
  console.info(
    `New order: ${order.type} ${order.side} ${order.product_id} ${
      order.quantity
    } ${order.price}`
  );
}

function messageSent(error) {
  if (error) {
    console.error('Message cannot be sent', error);
  }
}

function randomCurrency(min, max, fractionDigits) {
  return random(min, max).toFixed(fractionDigits);
}
