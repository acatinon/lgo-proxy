'use strict';

class OrderEncryptor {
  constructor(dependencies) {
    const { cryptoService, orderSerializer } = dependencies;
    this.cryptoService = cryptoService;
    this.orderSerializer = orderSerializer;
  }

  encryptOrder(key, order, timestamp) {
    const serializedOrder = this.orderSerializer.orderToCSV(order, timestamp);
    const encryptedOrder = this.cryptoService.encrypt(
      key.publicKey,
      Buffer.from(serializedOrder)
    );
    return encryptedOrder.toString('base64');
  }

  encryptCancelOrder(key, orderId, timestamp) {
    const serializedCancelOrder = this.orderSerializer.cancelToCSV(
      orderId,
      timestamp
    );
    const encryptedCancelOrder = this.cryptoService.encrypt(
      key.publicKey,
      Buffer.from(serializedCancelOrder)
    );
    return encryptedCancelOrder.toString('base64');
  }
}

module.exports = { OrderEncryptor };
