'use strict';

const { Router } = require('express');

function mapDeprecatedRoutes(routing, exchangeProxy, ordersPost, deleteOrderPost) {
  routing.get('/currencies', (request, response) => {
    request.url = '/v1/live' + request.url;
    exchangeProxy.web(request, response);
  });
  routing.get('/products/:id/book', (request, response) => {
    request.url = '/v1/history' + request.url;
    exchangeProxy.web(request, response);
  });
  routing.get('/products/:id/trades', (request, response) => {
    request.url = '/v1/history' + request.url;
    exchangeProxy.web(request, response);
  });
  routing.get('/products/:id/candles', (request, response) => {
    request.url = '/v1/history' + request.url;
    exchangeProxy.web(request, response);
  });
  routing.get('/products', (request, response) => {
    request.url = '/v1/live' + request.url;
    exchangeProxy.web(request, response);
  });
  routing.get('/orders/:id', (request, response) => {
    request.url = '/v1/history' + request.url;
    exchangeProxy.web(request, response);
  });
  routing.get('/orders', (request, response) => {
    request.url = '/v1/history' + request.url;
    exchangeProxy.web(request, response);
  });
  routing.get('/trades', (request, response) => {
    request.url = '/v1/history' + request.url;
    exchangeProxy.web(request, response);
  });
  routing.post('/orders', ordersPost);
  routing.delete('/orders/:id', deleteOrderPost);
}

function mapLiveRoutes(routing, exchangeProxy, ordersPost, deleteOrderPost) {
  routing.get('/v1/live/balances', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/live/currencies', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/live/orders', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/live/products', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/live/products/:id/book', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/live/products/:id/trades', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.post('/v1/live/orders', ordersPost);
  routing.delete('/v1/live/orders/:id', deleteOrderPost);
}

function mapHistoryRoutes(routing, exchangeProxy) {
  routing.get('/v1/history/products/:id/book', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/history/products/:id/trades', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/history/products/:id/candles', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/history/orders/:id', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/history/orders', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/v1/history/trades', (request, response) =>
    exchangeProxy.web(request, response)
  );
}

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
  routing.post('/prepare-order', prepareOrderPost);
  routing.post('/prepare-cancel', prepareCancelPost);
  routing.get('/operations', (request, response) => {
    if (!request.query.max_results) {
      request.url = `${request.url}&max_results=100`;
    }
    return accountProxy.web(request, response);
  });
  mapDeprecatedRoutes(routing, exchangeProxy, ordersPost, deleteOrderPost);
  mapLiveRoutes(routing, exchangeProxy, ordersPost, deleteOrderPost);
  mapHistoryRoutes(routing, exchangeProxy);
  return routing;
}

module.exports = { createRouter };
