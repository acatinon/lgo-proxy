'use strict';

module.exports = {
  rootDir: '../',
  testRegex: '/lib/.*\\.spec\\.js$',
  moduleFileExtensions: ['js', 'json'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/out/']
};
