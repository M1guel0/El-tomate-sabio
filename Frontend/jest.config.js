// Frontend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'html'],
  coverageDirectory: 'coverage',
  // Buscar archivos en estas extensiones
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  // Incluir estos archivos en cobertura
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js'
  ]
};