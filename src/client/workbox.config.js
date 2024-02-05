module.exports = {
    globDirectory: 'build/',
    globPatterns: [
        '**/*.{js,css,html,png,svg,jpg,jpeg}',
    ],
    swDest: 'build/service-worker.js',
    clientsClaim: true, // activate immediately
    skipWaiting: true, // activate immediately
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
    mode: 'debug',
};