module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/*.test.tsx'],
    transformIgnorePatterns: [
        "/node_modules/(?!(d3)/)"
    ]
};