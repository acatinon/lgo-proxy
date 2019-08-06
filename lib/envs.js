'use strict';

const envs = {
  local: {
    LGO_EXCHANGE_URL: 'http://localhost:8081',
    LGO_ACCOUNTING_URL: 'http://localhost:8087',
    LGO_WS_URL: 'ws://localhost:8084',
    LGO_KEYS_URL: 'http://localhost:3001/keys'
  },
  sandbox: {
    LGO_EXCHANGE_URL: 'https://exchange-api.sandbox.lgo.markets',
    LGO_ACCOUNTING_URL: 'https://account-api.sandbox.lgo.markets',
    LGO_WS_URL: 'wss://ws.sandbox.lgo.markets',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-sandbox_batch_keys'
  },
  production: {
    LGO_EXCHANGE_URL: 'https://exchange-api.exchange.lgo.markets',
    LGO_ACCOUNTING_URL: 'https://account-api.exchange.lgo.markets',
    LGO_WS_URL: 'wss://ws.exchange.lgo.markets',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-markets-keys'
  }
};

const deprecatedEnvs = {
  'markets-sandbox': envs.sandbox,
  'exchange-sandbox': envs.sandbox,
  'markets-production': envs.production,
  'exchange-production': envs.production
};

function setEnv(name) {
  process.env = Object.assign(
    {},
    deprecatedEnvs[name],
    envs[name],
    process.env
  );
}

module.exports = { setEnv };
