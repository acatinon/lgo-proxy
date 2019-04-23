'use strict';
const { OrderType } = require('./orderType');

class OrderSerializer {
  orderToCSV(order, timestamp) {
    const parts = [
      order.type,
      order.side,
      order.productId,
      order.quantity,
      order.price,
      order.type === OrderType.market ? '' : 'gtc',
      timestamp
    ];
    return parts.join(',');
  }

  cancelToCSV(orderId, timestamp) {
    const parts = ['C', orderId, timestamp];
    return parts.join(',');
  }
}

module.exports = { OrderSerializer };
