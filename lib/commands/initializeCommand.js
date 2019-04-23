'use strict';

const { Signer } = require('../tools/signer');
const { CryptoService } = require('../tools/cryptoService');

/* eslint-disable no-console */

function initializeCommand(options) {
  const { signerLibraryPath, signerPin } = options;

  const signer = new Signer({
    libraryPath: signerLibraryPath,
    pin: signerPin,
    logger: console
  });

  if (signer.isHsmInitialized()) {
    console.log('Hsm already initialised\n');
    printKey();
  } else {
    signer.initialize();
    signer.ensureRSAKeyAvailable();
    console.log('Hsm initialized\n');
    printKey();
  }

  function printKey() {
    const cryptoService = new CryptoService();
    const publicKey = signer.getRSAPublicKey();
    console.log('Public key:');
    console.log(publicKey);
    console.log('');
    console.log('Fingerprint:');
    console.log(cryptoService.createPublicKeyFingerprint(publicKey));
  }
}

module.exports = { initializeCommand };
