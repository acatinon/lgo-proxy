'use strict';

const { pick } = require('lodash/fp');
const yargs = require('yargs');

const { infoCommand, initializeCommand, startCommand } = require('./commands');

const options = {
  'signer-library-path': {
    describe: 'signer library path',
    demand: true,
    type: 'string'
  },
  'signer-pin': {
    describe: 'signer pin',
    demand: true,
    type: 'string'
  },
  env: {
    describe: 'environment',
    demand: true,
    default: 'markets-production',
    choices: ['local', 'markets-sandbox', 'markets-production'],
    type: 'string'
  },
  'access-key': {
    describe: 'access key',
    demand: true,
    type: 'string'
  }
};

yargs
  .env('LGO')
  .command(
    'info',
    'display proxy information like public key',
    yargs =>
      yargs.options(pick(['signer-library-path', 'signer-pin'], options)),
    argv =>
      infoCommand({
        signerLibraryPath: argv['signer-library-path'],
        signerPin: argv['signer-pin']
      })
  )
  .command(
    'init',
    'initialize the proxy',
    yargs =>
      yargs.options(pick(['signer-library-path', 'signer-pin'], options)),
    argv =>
      initializeCommand({
        signerLibraryPath: argv['signer-library-path'],
        signerPin: argv['signer-pin']
      })
  )
  .command(
    ['start', '$0'],
    'start the proxy server',
    yargs =>
      yargs.options(
        pick(
          ['signer-library-path', 'signer-pin', 'env', 'access-key'],
          options
        )
      ),
    argv =>
      startCommand({
        signerLibraryPath: argv['signer-library-path'],
        signerPin: argv['signer-pin'],
        env: argv.env,
        accessKey: argv['access-key']
      })
  ).argv;
