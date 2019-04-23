'use strict';

function createHeadersFactory(dependencies) {
  const { configuration, createUtcDate, signer } = dependencies;
  return targetUrl => {
    const now = createUtcDate();
    const timestamp = now.getTime();
    const accessKey = configuration.accessKey;
    const urlToSign = createUrlToSign(targetUrl);
    const signature = signer.sign(`${timestamp}\n${urlToSign}`);
    return {
      'X-LGO-DATE': timestamp,
      Authorization: `LGO ${accessKey}:${signature}`
    };
  };

  function createUrlToSign(url) {
    return url
      .replace('http://', '')
      .replace('https://', '')
      .replace('ws://', '')
      .replace('wss://', '');
  }
}

module.exports = { createHeadersFactory };
