'use strict';

const { createUtcDate, CryptoService, Http, Signer } = require('./tools');
const {
  createDownloadKeys,
  createDownloadKeysPeriodically,
  KeyRepository,
  OrderEncryptor,
  OrderSerializer
} = require('./domain');
const {
  createExchangeProxy,
  createWebSocketProxy,
  createPublicKeyGet,
  createStatusGet,
  createPrepareCancelPost,
  createPrepareOrderPost,
  createOrdersPost,
  createDeleteOrderPost,
  createRouter,
  createRequestContextMiddleware,
  createErrorProxyMiddleware,
  createErrorWsMiddleware,
  createBodyProxyMiddleware,
  createErrorLoggerMiddleware,
  createAuthenticationProxyMiddleware,
  createNotFoundMiddleware,
  createErrorMiddleware,
  createRequestContextProxyMiddleware,
  createRequestLoggerMiddleware,
  createHeadersFactory
} = require('./web');

function bootstrap(dependencies) {
  const { configuration, defaultLogger } = dependencies;
  const logger = defaultLogger;

  const http = new Http({ timeout: configuration.requestTimeout });
  const signer = new Signer({
    libraryPath: configuration.signer.signerLibraryPath,
    pin: configuration.signer.signerPin,
    logger
  });

  const keyRepository = new KeyRepository({ createUtcDate, logger });
  const downloadKeys = createDownloadKeys({
    configuration,
    createUtcDate,
    logger,
    http,
    keyRepository
  });
  const downloadKeysPeriodically = createDownloadKeysPeriodically({
    downloadKeys,
    logger,
    configuration
  });

  const orderSerializer = new OrderSerializer();
  const unixTimestampGenerator = () => Math.floor(new Date().getTime() / 1000);
  const cryptoService = new CryptoService();
  const orderEncryptor = new OrderEncryptor({ orderSerializer, cryptoService });

  const headersFactory = createHeadersFactory({
    configuration,
    createUtcDate,
    signer
  });

  const errorProxyMiddleware = createErrorProxyMiddleware({ logger });
  const errorWsMiddleware = createErrorWsMiddleware({ logger });
  const authenticationProxyMiddleware = createAuthenticationProxyMiddleware({
    headersFactory,
    logger
  });
  const bodyProxyMiddleware = createBodyProxyMiddleware({
    logger
  });
  const errorLoggerMiddleware = createErrorLoggerMiddleware({
    logger
  });
  const requestContextMiddleware = createRequestContextMiddleware();
  const requestContextProxyMiddleware = createRequestContextProxyMiddleware({
    logger
  });
  const requestLoggerMiddleware = createRequestLoggerMiddleware({
    logger,
    options: {
      ignoredRoutes: ['/healthz']
    }
  });
  const notFoundMiddleware = createNotFoundMiddleware();
  const errorMiddleware = createErrorMiddleware({ configuration });

  const exchangeProxy = createExchangeProxy({
    configuration,
    authenticationProxyMiddleware,
    bodyProxyMiddleware,
    errorProxyMiddleware,
    requestContextProxyMiddleware
  });

  const { proxifyServer: proxifyServerWebSocket } = createWebSocketProxy({
    configuration,
    errorWsMiddleware,
    headersFactory
  });

  const publicKeyGet = createPublicKeyGet({ signer });

  const statusGet = createStatusGet();

  const deleteOrderPost = createDeleteOrderPost({
    logger,
    exchangeProxy,
    keyRepository,
    orderEncryptor,
    signer,
    unixTimestampGenerator
  });

  const prepareCancelPost = createPrepareCancelPost({
    logger,
    keyRepository,
    orderEncryptor,
    signer,
    unixTimestampGenerator
  });

  const prepareOrderPost = createPrepareOrderPost({
    logger,
    keyRepository,
    orderEncryptor,
    signer,
    unixTimestampGenerator
  });

  const ordersPost = createOrdersPost({
    logger,
    exchangeProxy,
    keyRepository,
    orderEncryptor,
    signer,
    unixTimestampGenerator
  });

  const router = createRouter({
    exchangeProxy,
    publicKeyGet,
    deleteOrderPost,
    statusGet,
    prepareCancelPost,
    prepareOrderPost,
    ordersPost
  });

  return {
    logger,
    configuration,
    requestContextMiddleware,
    requestLoggerMiddleware,
    notFoundMiddleware,
    errorLoggerMiddleware,
    errorMiddleware,
    router,
    downloadKeysPeriodically,
    proxifyServerWebSocket,
    headersFactory,
    signer
  };
}

module.exports = { bootstrap };
