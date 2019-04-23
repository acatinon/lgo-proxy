'use strict';

const { maxBy } = require('lodash/fp');

const { MemoryRepository } = require('../../tools');

const selectKey = (keys, now) =>
  maxBy(key => Math.min(now - key.enabledAt, key.disabledAt - now))(keys);

class KeyRepository extends MemoryRepository {
  constructor(dependencies) {
    super(dependencies);
    const { createUtcDate } = dependencies;
    this.createUtcDate = createUtcDate;
  }

  getCurrent() {
    const now = this.createUtcDate();
    const currents = this.getAll().filter(
      k => k.enabledAt <= now && now < k.disabledAt
    );
    if (currents.length === 0) {
      return null;
    }
    return selectKey(currents, now);
  }
}

module.exports = { KeyRepository };
