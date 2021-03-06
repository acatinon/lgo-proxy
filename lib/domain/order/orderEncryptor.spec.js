'use strict';

const { examples } = require('../../test');
const { OrderEncryptor } = require('./orderEncryptor');
const { OrderType } = require('./orderType');
const { OrderStatus } = require('./orderStatus');
const { OrderSide } = require('./orderSide');
const { OrderSerializer } = require('./orderSerializer');

const CryptoServiceMock = jest.fn(() => ({
  encrypt: jest.fn().mockReturnValue(Buffer.from(''))
}));

const encryptionBuffer = Buffer.from('encrypted');
const encryptionBase64 = encryptionBuffer.toString('base64');
const unixTimestamp = 1000;

describe('Order encryptor', () => {
  let cryptoService;
  let encryptor;
  let orderSerializer;

  beforeEach(() => {
    cryptoService = new CryptoServiceMock();
    orderSerializer = new OrderSerializer();
    encryptor = new OrderEncryptor({ cryptoService, orderSerializer });
  });

  describe('on encrypt order', () => {
    it('could encrypt a market one', async () => {
      const order = createMarketOrder();

      encryptor.encryptOrder(examples.key, order, unixTimestamp);

      expect(cryptoService.encrypt).toHaveBeenCalledWith(
        examples.key.publicKey,
        Buffer.from(`M,B,BTC-USD,100,,,${unixTimestamp}`)
      );
    });

    it('could encrypt a market one with null price', async () => {
      const order = createMarketOrder({ price: null });

      encryptor.encryptOrder(examples.key, order, unixTimestamp);

      expect(cryptoService.encrypt).toHaveBeenCalledWith(
        examples.key.publicKey,
        Buffer.from(`M,B,BTC-USD,100,,,${unixTimestamp}`)
      );
    });

    function createMarketOrder(data = {}) {
      return {
        type: OrderType.market,
        status: OrderStatus.sent,
        side: OrderSide.buy,
        quantity: 100,
        remainingQuantity: 100,
        productId: 'BTC-USD',
        creationDate: examples.juneIso,
        ...data
      };
    }

    it('could encrypt a limit one', async () => {
      const order = {
        type: OrderType.limit,
        status: OrderStatus.sent,
        side: OrderSide.buy,
        productId: 'BTC-USD',
        quantity: 100,
        remainingQuantity: 100,
        price: 42,
        creationDate: examples.juneIso
      };

      encryptor.encryptOrder(examples.key, order, unixTimestamp);

      expect(cryptoService.encrypt).toHaveBeenCalledWith(
        examples.key.publicKey,
        Buffer.from(`L,B,BTC-USD,100,42,gtc,${unixTimestamp}`)
      );
    });

    it('should return the encryption result', async () => {
      const order = {
        type: OrderType.market,
        status: OrderStatus.sent,
        side: OrderSide.buy,
        quantity: 100,
        remainingQuantity: 100,
        productId: 'BTC-USD',
        creationDate: examples.juneIso
      };
      cryptoService.encrypt = jest.fn().mockReturnValue(encryptionBuffer);

      const encrypted = encryptor.encryptOrder(
        examples.key,
        order,
        unixTimestamp
      );

      expect(encrypted).toEqual(encryptionBase64);
    });
  });

  describe('on encrypt cancel order', () => {
    it('could encrypt using crypto service', async () => {
      encryptor.encryptCancelOrder(examples.key, '1', unixTimestamp);

      expect(cryptoService.encrypt).toHaveBeenCalledWith(
        examples.key.publicKey,
        Buffer.from(`C,1,${unixTimestamp}`)
      );
    });

    it('should return the encryption result', async () => {
      cryptoService.encrypt = jest.fn().mockReturnValue(encryptionBuffer);

      const encrypted = encryptor.encryptCancelOrder(
        examples.key,
        '1',
        cryptoService
      );

      expect(encrypted).toEqual(encryptionBase64);
    });
  });
});
