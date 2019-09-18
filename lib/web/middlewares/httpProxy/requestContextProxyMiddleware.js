'use strict';

function createRequestContextProxyMiddleware(dependencies) {
  const { logger, configuration } = dependencies;

  return (proxyRequest, request, response, options) => {
    const rawProtocol = options.target.protocol;
    const protocol = rawProtocol.replace(':', '');
    const host = options.target.host;
    const rawPath = proxyRequest.path;
    const path = rawPath.startsWith('/') ? rawPath.replace('/', '') : rawPath;
    const targetUrl = `${protocol}://${host}/${path}`;
    logger.debug(
      `Proxying ${request.context.method} ${request.context.url} to ${
        request.method
      } ${targetUrl}`
    );
    proxyRequest.context = { targetUrl };
    proxyRequest.setHeader('X-LGO-CLIENT-VERSION', configuration.app.name + ' ' + configuration.app.version);
  };
}

module.exports = { createRequestContextProxyMiddleware };
