module.exports = {
    globDirectory: 'build/',
    globPatterns: [
        '**/*.{js,css,html,png,svg,jpg,jpeg}',
    ],
    swDest: 'build/service-worker.js',
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
    mode: 'debug',
    runtimeCaching: [
        {
            urlPattern: /\*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'all',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60,
                },
            },
        },
    ],
};