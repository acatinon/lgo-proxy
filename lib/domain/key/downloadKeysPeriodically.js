'use strict';

function createDownloadKeysPeriodically(dependencies) {
  const { downloadKeys, logger, configuration } = dependencies;

  return () => {
    let timeout;
    logger.info('Downloading keys periodically');
    doJob();
    return cancel;

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
      timeout = setTimeout(doJob, configuration.keys.downloadInterval);
    }

    function cancel() {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  };
}

module.exports = { createDownloadKeysPeriodically };
