'use strict';

const envs = {
  local: {
    LGO_EXCHANGE_URL: 'http://localhost:8081',
    LGO_WS_URL: 'ws://localhost:8084',
    LGO_KEYS_URL: 'http://localhost:3001/keys'
  },
  'markets-sandbox': {
    LGO_EXCHANGE_URL: 'https://exchange-api.sandbox.lgo.markets',
    LGO_WS_URL: 'wss://ws.sandbox.lgo.markets',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-sandbox_batch_keys'
  },
  'markets-production': {
    LGO_EXCHANGE_URL: 'https://exchange-api.exchange.lgo.markets',
    LGO_WS_URL: 'wss://ws.exchange.lgo.markets',
    LGO_KEYS_URL: 'https://storage.googleapis.com/lgo-markets-keys'
  }
};

function setEnv(name) {
  Object.assign(process.env, envs[name]);
}

module.exports = { setEnv };
