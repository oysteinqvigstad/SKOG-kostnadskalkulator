/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: 'build'
    },
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: 'v8'
        },
    },
    plugins: [
        react(),
        viteTsconfigPaths(),
        svgr({
            include: '**/*.svg?react',
        }),
    ],
});