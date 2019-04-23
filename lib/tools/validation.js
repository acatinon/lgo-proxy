'use strict';

const { cloneDeep } = require('lodash/fp');
const Ajv = require('ajv');

class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.payload = { errors };
  }
}

function createValidation(schema) {
  const validator = new Ajv({ allErrors: true, coerceTypes: true }).compile(
    schema
  );
  return object => {
    const cloned = cloneDeep(object);
    if (!validator(cloned)) {
      throw new ValidationError(validator.errors || []);
    }
    return cloned;
  };
}

module.exports = { ValidationError, createValidation };
