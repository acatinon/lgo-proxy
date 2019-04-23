'use strict';

const { OrderType, OrderSide } = require('../../domain');
const { createValidation } = require('../../tools');

const bodySchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: Object.values(OrderType) },
    side: { type: 'string', enum: Object.values(OrderSide) },
    product_id: { type: 'string' },
    quantity: { type: 'string' },
    price: { type: 'string' },
    reference: { type: 'number' }
  },
  required: ['type', 'side', 'product_id', 'quantity'],
  additionalProperties: false
};

const validateBody = createValidation(bodySchema);

function createPrepareOrderPost(dependencies) {
  const {
    logger,
    keyRepository,
    orderEncryptor,
    signer,
    unixTimestampGenerator
  } = dependencies;
  return (request, response) => {
    validateBody(request.body);
    const timestamp = unixTimestampGenerator();
    const { order, reference } = parseBody(request.body);
    const key = getKeyToUse();
    const encryptedOrder = orderEncryptor.encryptOrder(key, order, timestamp);
    const value = signer.sign(encryptedOrder);
    const signature = {
      source: signer.algorithm(),
      value
    };
    response.send({
      key_id: key.id,
      order: encryptedOrder,
      signature,
      reference
    });
  };

  function parseBody(body) {
    const { type, side, product_id, quantity, price, reference } = body;
    return {
      order: { type, side, productId: product_id, quantity, price },
      reference
    };
  }

  function getKeyToUse() {
    const key = keyRepository.getCurrent();
    if (!key) {
      throw new Error('No encryption key found');
    }
    logger.debug('Using key %s to encrypt order', key.id);
    return key;
  }
}

module.exports = { createPrepareOrderPost };
