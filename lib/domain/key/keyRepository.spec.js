'use strict';

const { examples, SilentLogger } = require('../../test');
const { KeyRepository } = require('./keyRepository');

describe('Key repository', () => {
  let createUtcDate;
  let repository;

  beforeEach(() => {
    createUtcDate = jest.fn().mockReturnValue(examples.june);
    repository = new KeyRepository({
      createUtcDate,
      logger: new SilentLogger()
    });
  });

  describe('on get current', () => {
    it('should get a enabled now key', async () => {
      repository.entities.set(
        examples.keyFromMayToJune.id,
        examples.keyFromMayToJune
      );
      repository.entities.set(
        examples.keyFromJuneToJuly.id,
        examples.keyFromJuneToJuly
      );
      repository.entities.set(
        examples.keyFromJulyToAugust.id,
        examples.keyFromJulyToAugust
      );

      const key = repository.getCurrent();

      expect(key).toEqual(examples.keyFromJuneToJuly);
    });

    it('should get the most available key if the most recent key is too close from period beginning', async () => {
      repository.entities.set(
        examples.keyFromMidMayToMidJune.id,
        examples.keyFromMidMayToMidJune
      );
      repository.entities.set(
        examples.keyFromJuneToJuly.id,
        examples.keyFromJuneToJuly
      );

      const key = repository.getCurrent();

      expect(key).toEqual(examples.keyFromMidMayToMidJune);
    });

    it('should get the most available key if the less recent key is too close from period ending', async () => {
      repository.entities.set(
        examples.keyFromMayToJuneTheThird.id,
        examples.keyFromMayToJuneTheThird
      );
      repository.entities.set(
        examples.keyFromMidMayToMidJune.id,
        examples.keyFromMidMayToMidJune
      );

      const key = repository.getCurrent();

      expect(key).toEqual(examples.keyFromMidMayToMidJune);
    });

    it('should ignore a key still not enabled now', async () => {
      createUtcDate.mockReturnValue(examples.may);
      repository.entities.set(
        examples.keyFromMayToJune.id,
        examples.keyFromMayToJune
      );
      repository.entities.set(
        examples.keyFromJuneToJuly.id,
        examples.keyFromJuneToJuly
      );

      const key = repository.getCurrent();

      expect(key).toEqual(examples.keyFromMayToJune);
    });

    it('should return nothing if all keys are disabled', () => {
      createUtcDate.mockReturnValue(examples.august);
      repository.entities.set(
        examples.keyFromMidMayToMidJune.id,
        examples.keyFromMidMayToMidJune
      );
      repository.entities.set(
        examples.keyFromJuneToJuly.id,
        examples.keyFromJuneToJuly
      );

      const key = repository.getCurrent();

      expect(key).toBeNull();
    });
  });
});
