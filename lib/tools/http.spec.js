'use strict';

const { createServer } = require('http');

const { Http } = require('./http');

describe('Http', () => {
  let server;
  let http;
  let timeout;

  beforeEach(done => {
    http = new Http({ timeout: 500 });

    server = createServer((request, response) => {
      const url = request.url;
      switch (url) {
        case '/hello':
          response.writeHead(200);
          response.write('hello');
          response.end();
          break;
        case '/timeout':
          timeout = setTimeout(() => {
            response.writeHead(200);
            response.write('should have failed');
            response.end();
          }, 500);
          break;
        case '/error':
          response.writeHead(400);
          response.end();
          break;
        default:
          response.writeHead(404);
          response.end();
          break;
      }
    });
    server.listen(3333, done);
  });

  afterEach(done => {
    clearTimeout(timeout);
    server.close(done);
  });

  describe('on get', () => {
    it('should return sent data', async () => {
      const result = await http.get('http://localhost:3333/hello');

      expect(result).toEqual('hello');
    });
  });

  describe('on any request', () => {
    it('should detect a timeout', async () => {
      const timeouting = http.get('http://localhost:3333/timeout');

      await expect(timeouting).rejects.toThrow('Timeout expired (500ms)');
    });

    it('should fail if status is an error one', async () => {
      const timeouting = http.get('http://localhost:3333/error');

      await expect(timeouting).rejects.toThrow();
    });
  });
});
