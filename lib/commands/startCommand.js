'use strict';

const { Server } = require('../web');
const { logFactory, patchConsole } = require('../tools');
const { loadConfiguration } = require('../configuration');
const { bootstrap } = require('../bootstrap');
const { setEnv } = require('../envs');

function startCommand(options) {
  const { signerLibraryPath, signerPin, env, accessKey, authorizedOrigin } = options;

  setEnv(env);
  process.env.LGO_SIGNER_LIBRARY_PATH = signerLibraryPath;
  process.env.LGO_SIGNER_PIN = signerPin;
  process.env.LGO_ACCESS_KEY = accessKey;

  const configuration = loadConfiguration();
  const { defaultLogger } = logFactory({ configuration });

  patchConsole(defaultLogger);

  const dependencies = bootstrap({
    configuration,
    defaultLogger
  });

  const server = new Server(dependencies, authorizedOrigin);

  server.start().catch(error => {
    defaultLogger.error('Impossible to start server', { error });
    printAdvices();
  });

  function printAdvices() {
    const errors = [
      'The proxy is not initialized',
      'The provided pin is wrong',
      'Access rights issues on token directory'
    ];
    return defaultLogger.info(`Common errors:${errors.map(e => `\n  * ${e}`)}`);
  }
}

module.exports = { startCommand };
