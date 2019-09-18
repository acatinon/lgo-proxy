'use strict';

const { SilentLogger } = require('../../../test');
const {
  createRequestContextProxyMiddleware
} = require('./requestContextProxyMiddleware');

describe('Request context proxy middleware', () => {
  let middleware;

  beforeEach(() => {
    middleware = createRequestContextProxyMiddleware({
      logger: new SilentLogger(),
      configuration: { app: { name: 'LGO', version: '1.1' } }
    });
  });

  it('should put target url in request context', () => {
    const proxyRequest = {
      path: '/a_path',
      setHeader: () => {}
    };
    middleware(proxyRequest, createRequest(), {}, createProxyOptions());

    expect(proxyRequest.context.targetUrl).toEqual('http://the_server/a_path');
  });

  it('should handle complexe url', () => {
    const proxyRequest = {
      path: '/a_path?query=a_cool_query&sort=asc',
      setHeader: () => {}
    };
    middleware(proxyRequest, createRequest(), {}, createProxyOptions());

    expect(proxyRequest.context.targetUrl).toEqual(
      'http://the_server/a_path?query=a_cool_query&sort=asc'
    );
  });

  it('should handle a weird url', () => {
    const proxyRequest = {
      path: 'a/relative/path',
      setHeader: () => {}
    };
    middleware(proxyRequest, createRequest(), {}, createProxyOptions());

    expect(proxyRequest.context.targetUrl).toEqual(
      'http://the_server/a/relative/path'
    );
  });

  it('should handle a weird protocol', () => {
    const proxyRequest = {
      path: 'a_path',
      setHeader: () => {}
    };
    middleware(
      proxyRequest,
      createRequest(),
      {},
      createProxyOptions({ protocol: 'http:' })
    );

    expect(proxyRequest.context.targetUrl).toEqual('http://the_server/a_path');
  });

  function createProxyOptions(target = {}) {
    return {
      target: {
        protocol: 'http',
        host: 'the_server',
        ...target
      }
    };
  }

  function createRequest() {
    return { context: {} };
  }
});
