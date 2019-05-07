'use strict';

const envs = {
  local: {
    LGO_EXCHANGE_URL: 'http://localhost:8081',
    LGO_ACCOUNT_URL: 'ws://localhost:8087',
    LGO_WS_URL: 'ws://localhost:8084',
    LGO_KEYS_URL: 'http://localhost:3001/keys'
  },
  'markets-sandbox': {
    LGO_EXCHANGE_URL: 'https://exchange-api.sandbox.lgo.markets',
    LGO_ACCOUNT_URL: 'https://account-api.sandbox.lgo.markets',
    LGO_WS_URL: 'wss://ws.sandbox.lgo.markets',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-sandbox_batch_keys'
  },
  'markets-production': {
    LGO_EXCHANGE_URL: 'https://exchange-api.exchange.lgo.markets',
    LGO_ACCOUNT_URL: 'https://account-api.exchange.lgo.markets',
    LGO_WS_URL: 'wss://ws.exchange.lgo.markets',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-markets-keys'
  }
};

function setEnv(name) {
  process.env = Object.assign({}, envs[name], process.env);
}

module.exports = { setEnv };
