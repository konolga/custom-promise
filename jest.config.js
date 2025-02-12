/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'node',
    transform: {},
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)']
};

module.exports = config;
