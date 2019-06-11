'use strict';

function createDownloadKeysPeriodically(dependencies) {
  const { downloadKeys, logger, configuration } = dependencies;
  return () => {
    logger.info('Downloading keys periodically');
    doJob();
  };

  async function doJob() {
    try {
      await downloadKeys();
    } catch (error) {
      logger.error('Job failed', { error });
    } finally {
      scheduleNext();
    }
  }

  function scheduleNext() {
    setTimeout(doJob, configuration.keys.downloadInterval);
  }
}

module.exports = { createDownloadKeysPeriodically };
