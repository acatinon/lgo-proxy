'use strict';

module.exports = {
  testRegex: '/lib/.*\\.spec\\.js$',
  moduleFileExtensions: ['js', 'json'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/out/']
};
