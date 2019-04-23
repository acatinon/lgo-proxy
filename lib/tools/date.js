'use strict';

const moment = require('moment');

function createUtcDate() {
  return moment.utc().toDate();
}

module.exports = { createUtcDate };
