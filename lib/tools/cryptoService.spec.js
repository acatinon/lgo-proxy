'use strict';

const { CryptoService } = require('./cryptoService');

const publicKey2048 = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkjYlw3oDxJ4dNTibL1D3
lPytGoySYbaZFC+NgPC7FzcqVKb2sXBsZPSDY8KolW5SWVmQp9S9Ft1H0n52tLZM
eAEEtUEjoGcDZ+EvZPTHJBvl1eZfbC04kCKijqB8UiiVnHP5GDQ8SGbF7iv89t0u
nUTTrRbDxs1LPjVwKSqjH2bi+T1SfKsjBwDzxZcW9c5ejDnUg2KagzqMm/0ZISLP
mIhxlHswiDWHi9+BIgn50Yfx0t2IwpWxKVYEjifpl9rtGn6Bh4rjGy1q/vcVWBCl
ImSOhcofzxemN3nigpXI3DFICTUZMJbkj0QHZYT4J3u+MMc9JXIfY2T6vn3+gS0n
dQIDAQAB
-----END PUBLIC KEY-----`;

describe('Crypto service', () => {
  let service;

  beforeEach(() => {
    service = new CryptoService();
  });

  describe('while encrypting', () => {
    it('should return a different message', () => {
      const plainText = 'Hello world';

      const encryptedBuffer = service.encrypt(
        publicKey2048,
        Buffer.from(plainText)
      );

      const encryptedText = encryptedBuffer.toString('utf-8');
      expect(plainText).not.toEqual(encryptedText);
    });

    describe('when using a key of 2048 bits', () => {
      it('should return a message of 2048 bits', () => {
        const plainText = 'Hello world';

        const encryptedText = service.encrypt(
          publicKey2048,
          Buffer.from(plainText)
        );

        expect(encryptedText).toHaveLength(2048 / 8);
      });
    });
  });

  describe('while creating a public key fingerprint', () => {
    it('should return a pkcs8 public MD5', () => {
      const md5 = service.createPublicKeyFingerprint(publicKey2048);

      expect(md5).toEqual('98:a7:a1:87:75:68:3f:3a:38:37:d5:dc:10:ae:98:d3');
    });

    it('should return an empty string if public key is empty', () => {
      const md5 = service.createPublicKeyFingerprint('');

      expect(md5).toEqual('');
    });
  });
});
