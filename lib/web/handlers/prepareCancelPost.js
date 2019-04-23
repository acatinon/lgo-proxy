'use strict';

const { createValidation } = require('../../tools');

const bodySchema = {
  type: 'object',
  properties: {
    order_id: { type: 'string' },
    reference: { type: 'number' }
  },
  required: ['order_id'],
  additionalProperties: false
};

const validateBody = createValidation(bodySchema);

function createPrepareCancelPost(dependencies) {
  const {
    logger,
    keyRepository,
    orderEncryptor,
    signer,
    unixTimestampGenerator
  } = dependencies;
  return (request, response) => {
    validateBody(request.body);
    const { orderId, reference } = parseBody(request.body);
    const key = getKeyToUse();
    const timestamp = unixTimestampGenerator();
    const encryptedOrder = orderEncryptor.encryptCancelOrder(
      key,
      orderId,
      timestamp
    );
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
    const { order_id, reference } = body;
    return { orderId: order_id, reference };
  }

  function getKeyToUse() {
    const key = keyRepository.getCurrent();
    if (!key) {
      throw new Error('No encryption key found');
    }
    logger.debug('Using key %s to encrypt order cancellation', key.id);
    return key;
  }
}

module.exports = { createPrepareCancelPost };
