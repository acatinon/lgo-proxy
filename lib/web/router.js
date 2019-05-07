'use strict';

const { Router } = require('express');

function createRouter(dependencies) {
  const {
    accountProxy,
    exchangeProxy,
    deleteOrderPost,
    prepareOrderPost,
    prepareCancelPost,
    ordersPost,
    publicKeyGet,
    statusGet
  } = dependencies;

  const routing = Router();
  routing.get('/publicKey', publicKeyGet);
  routing.get('/status', statusGet);
  routing.get('/currencies', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/products/:id/book', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/products/:id/trades', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/products', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.post('/prepare-order', prepareOrderPost);
  routing.post('/prepare-cancel', prepareCancelPost);
  routing.get('/orders/:id', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.delete('/orders/:id', deleteOrderPost);
  routing.post('/orders', ordersPost);
  routing.get('/orders', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/trades', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/operations', (request, response) =>
    accountProxy.web(request, response)
  );

  return routing;
}

module.exports = { createRouter };
