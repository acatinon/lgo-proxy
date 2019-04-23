'use strict';

const { RSA_PKCS1_OAEP_PADDING } = require('constants');
const { createHash, publicEncrypt } = require('crypto');

class CryptoService {
  encrypt(key, buffer) {
    const keyObject = {
      key,
      padding: RSA_PKCS1_OAEP_PADDING
    };
    return publicEncrypt(keyObject, buffer);
  }

  createPublicKeyFingerprint(publicKey) {
    if (!publicKey) {
      return '';
    }
    const keyWithoutDelimiters = publicKey
      .replace(/\r?\n|\r/g, '')
      .replace(/-----BEGIN.*-----(.*)-----END.*-----/m, '$1');
    const base64Key = Buffer.from(keyWithoutDelimiters, 'base64');
    const hashedKey = hash(base64Key);
    return withColons(hashedKey);

    function hash(text) {
      return createHash('md5')
        .update(text)
        .digest('hex');
    }

    function withColons(text) {
      return text.replace(/(.{2})(?=.)/g, '$1:');
    }
  }
}

module.exports = { CryptoService };
