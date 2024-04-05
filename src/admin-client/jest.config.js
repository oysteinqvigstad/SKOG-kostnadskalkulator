module.exports = {
    preset: 'ts-jest',
    testEnvironment: '@happy-dom/jest-environment',
    testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/*.test.tsx'],
    transformIgnorePatterns: [
        "/node_modules/(?!(d3)/)"
    ]
};