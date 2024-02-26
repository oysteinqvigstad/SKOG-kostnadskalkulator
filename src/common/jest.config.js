module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/*.test.tsx'],
    transformIgnorePatterns: [
        "/node_modules/(?!(d3)/)"
    ],
    transform: {
        '.ts': ['ts-jest', { tsconfig: './tsconfig.jest.json' }],
    },
};