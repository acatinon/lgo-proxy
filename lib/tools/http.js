'use strict';

const axios = require('axios');

class Http {
  constructor(options) {
    this._instance = createAxios(options);
  }

  get(url) {
    return this._instance.get(url).then(r => r.data);
  }
}

function createAxios(options = {}) {
  const { timeout, ...axiosOptions } = options;
  const instance = axios.create(axiosOptions);
  addTimeoutInterceptorsIfNeeded(instance, timeout);
  return instance;
}

function addTimeoutInterceptorsIfNeeded(instance, timeout) {
  if (timeout) {
    instance.interceptors.request.use(onRequest);
    instance.interceptors.response.use(onResponse, onResponseError);
  }

  function onRequest(config) {
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    config.requestTimeout = setTimeout(
      () => source.cancel(`Timeout expired (${timeout}ms)`),
      timeout
    );
    return config;
  }

  function onResponse(response) {
    clearTimeout(response.config.requestTimeout);
    return response;
  }

  function onResponseError(error) {
    if (axios.isCancel(error)) {
      return Promise.reject(new Error(error.message));
    }
    return Promise.reject(error);
  }
}

module.exports = { Http };
