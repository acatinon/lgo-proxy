'use strict';

const { createValidation } = require('../../tools');

const paramsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id'],
  additionalProperties: false
};

const validateParams = createValidation(paramsSchema);

const querySchema = {
  type: 'object',
  properties: {
    reference: { type: 'number' }
  },
  additionalProperties: false
};

const validateQuery = createValidation(querySchema);

function createDeleteOrderPost(dependencies) {
  const {
    logger,
    exchangeProxy,
    keyRepository,
    orderEncryptor,
    signer,
    unixTimestampGenerator
  } = dependencies;
  return (request, response) => {
    validateParams(request.params);
    validateQuery(request.query);
    const { id } = request.params;
    const { reference } = request.query;
    const key = getKeyToUse();
    const timestamp = unixTimestampGenerator();
    logger.debug('Using key %s to encrypt order cancellation', key.id);
    const encryptedOrder = orderEncryptor.encryptCancelOrder(
      key,
      id,
      timestamp
    );
    const value = signer.sign(encryptedOrder);
    const signature = {
      source: signer.algorithm(),
      value
    };
    request.body = {
      key_id: key.id,
      order: encryptedOrder,
      signature,
      reference
    };
    request.method = 'POST';
    request.url = '/orders';
    return exchangeProxy.web(request, response);
  };

  function getKeyToUse() {
    const key = keyRepository.getCurrent();
    if (!key) {
      throw new Error('No encryption key found');
    }
    logger.debug('Using key %s to encrypt order cancellation', key.id);
    return key;
  }
}

module.exports = { createDeleteOrderPost };
