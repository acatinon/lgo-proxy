'use strict';

const { OrderSerializer } = require('./orderSerializer');
const { OrderType } = require('./orderType');
const { OrderSide } = require('./orderSide');
const { OrderStatus } = require('./orderStatus');

describe('Order serializer', () => {
  const unixUtcTimestamp = 3600;
  const serializer = new OrderSerializer();

  describe('order to csv', () => {
    describe('with a limit order', () => {
      it('should serialized to csv', () => {
        const orderToPlace = {
          type: OrderType.limit,
          side: OrderSide.sell,
          productId: 'BTC-USD',
          quantity: 1,
          price: 10,
          status: OrderStatus.open
        };
        const result = serializer.orderToCSV(orderToPlace, unixUtcTimestamp);
        expect(result).toEqual(`L,S,BTC-USD,1,10,gtc,${unixUtcTimestamp}`);
      });
    });

    describe('with a market order', () => {
      it('should serialized to csv', () => {
        const orderToPlace = {
          type: OrderType.market,
          side: OrderSide.buy,
          productId: 'BTC-USD',
          quantity: 8,
          status: OrderStatus.open
        };
        const result = serializer.orderToCSV(orderToPlace, unixUtcTimestamp);
        expect(result).toEqual(`M,B,BTC-USD,8,,,${unixUtcTimestamp}`);
      });
    });
  });

  describe('cancel to csv', () => {
    it('should serialized to csv', () => {
      const result = serializer.cancelToCSV('1234', unixUtcTimestamp);
      expect(result).toEqual(`C,1234,${unixUtcTimestamp}`);
    });
  });
});
