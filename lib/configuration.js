'use strict';

const { mergeAll } = require('lodash/fp');
const { loadConfiguration: load } = require('@arpinum/config');

// Environment dependent
// Most variables should be required and without default value
const environment = {
  exchangeUrl: {
    env: 'LGO_EXCHANGE_URL',
    required: true
  },
  accountUrl: {
    env: 'LGO_ACCOUNT_URL',
    required: true
  },
  webSocketUrl: {
    env: 'LGO_WS_URL',
    required: true
  },
  keysUrl: {
    env: 'LGO_KEYS_URL',
    required: true
  }
};

// Defaults to have a working app from development to production
// Modify those values carefully
const reasonableDefaults = {
  port: {
    env: 'LGO_PORT',
    type: 'integer',
    default: 3002
  },
  accessKey: {
    env: 'LGO_ACCESS_KEY',
    required: true
  },
  log: {
    level: {
      env: 'LGO_LOG_LEVEL',
      default: 'info'
    },
    json: {
      env: 'LGO_LOG_JSON',
      type: 'boolean',
      default: false
    },
    colorize: {
      env: 'LGO_LOG_COLORIZE',
      type: 'boolean',
      default: false
    }
  },
  keys: {
    downloadPattern: {
      env: 'LGO_KEY_DOWNLOAD_PATTERN',
      default: '0 * * * * *' // every minutes
    },
    downloadConcurrency: {
      env: 'LGO_KEY_DOWNLOAD_CONCURRENCY',
      type: 'integer',
      default: 3
    }
  },
  signer: {
    signerLibraryPath: {
      env: 'LGO_SIGNER_LIBRARY_PATH',
      required: true
    },
    signerPin: {
      env: 'LGO_SIGNER_PIN',
      required: true
    }
  },
  verboseErrors: {
    env: 'LGO_VERBOSE_ERRORS',
    type: 'boolean',
    default: false
  },
  requestTimeout: {
    env: 'LGO_REQUEST_TIMEOUT',
    type: 'integer',
    default: 30000
  }
};

const schema = mergeAll([{}, environment, reasonableDefaults]);

function loadConfiguration() {
  return load(schema);
}

module.exports = { loadConfiguration };
