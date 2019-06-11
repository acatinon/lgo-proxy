'use strict';

const { SilentLogger, waitALittle } = require('../../test');
const {
  createDownloadKeysPeriodically
} = require('./downloadKeysPeriodically');

describe('Download keys periodically', () => {
  let downloadKeysPeriodically;
  let stop = null;
  let downloadKeys;

  beforeEach(() => {
    downloadKeys = jest.fn().mockResolvedValue(undefined);
    const configuration = {
      keys: {
        downloadInterval: 10
      }
    };
    downloadKeysPeriodically = createDownloadKeysPeriodically({
      downloadKeys,
      logger: new SilentLogger(),
      configuration
    });
  });

  afterEach(() => {
    if (stop) {
      stop();
    }
  });

  it('should download keys periodically', async () => {
    stop = downloadKeysPeriodically();

    await waitALittle();
    expect(downloadKeys).toHaveBeenCalled();
  });
});
