'use strict';

const { SilentLogger, waitALittle } = require('../../test');
const {
  createDownloadKeysPeriodically
} = require('./downloadKeysPeriodically');

describe('Download keys periodically', () => {
  let downloadKeysPeriodically;
  let cancel;
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
    if (cancel) {
      cancel();
    }
  });

  it('should download keys periodically', async () => {
    cancel = downloadKeysPeriodically();

    await waitALittle();
    expect(downloadKeys).toHaveBeenCalled();
  });
});
