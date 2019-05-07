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
  routing.get('/operations', (request, response) => {
    const newQuery = Object.assign({}, request.query, { max_results: 100 });
    const newRequest = Object.assign({}, request, { query: newQuery });
    return accountProxy.web(newRequest, response);
  });

  return routing;
}

module.exports = { createRouter };
