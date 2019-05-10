'use strict';

const envs = {
  local: {
    LGO_EXCHANGE_URL: 'http://localhost:8081',
    LGO_ACCOUNTING_URL: 'ws://localhost:8087',
    LGO_WS_URL: 'ws://localhost:8084',
    LGO_KEYS_URL: 'http://localhost:3001/keys'
  },
  'markets-sandbox': {
    LGO_EXCHANGE_URL: 'https://exchange-api.sandbox.lgo.markets',
    LGO_ACCOUNTING_URL: 'https://account-api.sandbox.lgo.markets',
    LGO_WS_URL: 'wss://ws.sandbox.lgo.markets',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-sandbox_batch_keys'
  },
  'markets-production': {
    LGO_EXCHANGE_URL: 'https://exchange-api.exchange.lgo.markets',
    LGO_ACCOUNTING_URL: 'https://account-api.exchange.lgo.markets',
    LGO_WS_URL: 'wss://ws.exchange.lgo.markets',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-markets-keys'
  },
  'exchange-sandbox': {
    LGO_EXCHANGE_URL: 'https://exchange-api.sandbox.lgo.exchange',
    LGO_ACCOUNTING_URL: 'https://account-api.sandbox.lgo.exchange',
    LGO_WS_URL: 'wss://ws.sandbox.lgo.exchange',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-sandbox_batch_keys'
  },
  'exchange-production': {
    LGO_EXCHANGE_URL: 'https://exchange-api.trading.lgo.exchange',
    LGO_ACCOUNTING_URL: 'https://account-api.trading.lgo.exchange',
    LGO_WS_URL: 'wss://ws.trading.lgo.exchange',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-markets-keys'
  }
};

function setEnv(name) {
  process.env = Object.assign({}, envs[name], process.env);
}

module.exports = { setEnv };
