'use strict';

const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');

class Server {
  constructor(dependencies) {
    const {
      configuration,
      logger,
      requestLoggerMiddleware,
      requestContextMiddleware,
      notFoundMiddleware,
      errorLoggerMiddleware,
      errorMiddleware,
      router,
      downloadKeysPeriodically,
      proxifyServerWebSocket,
      signer
    } = dependencies;
    this._configuration = configuration;
    this._logger = logger;
    this._signer = signer;
    this._downloadKeysPeriodically = downloadKeysPeriodically;
    const app = express();
    app.use(requestLoggerMiddleware);
    app.use(requestContextMiddleware);
    app.use(bodyParser.json());
    app.use(router);
    app.use(notFoundMiddleware);
    app.use(errorLoggerMiddleware);
    app.use(errorMiddleware);
    this.server = createServer(app);
    proxifyServerWebSocket(this.server);
  }

  async start() {
    const self = this;
    await this._signer.assertHsmInitialized();
    await this._signer.assertPublicKeyAvailable();
    await startServer();
    this._downloadKeysPeriodically();
    this._logger.info('Server started on port %s', this._configuration.port);

    function startServer() {
      return new Promise((resolve, reject) => {
        self.server.listen(self._configuration.port);
        self.server.on('error', error => {
          self._logger.error('Server error', { error });
          reject(error);
        });
        self.server.on('listening', () => {
          resolve();
        });
      });
    }
  }
}

module.exports = { Server };
