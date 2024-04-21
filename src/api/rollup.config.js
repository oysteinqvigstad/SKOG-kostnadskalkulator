// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts', // Point to your entry file, adjust as needed
    output: {
        file: 'dist/bundle.js', // Output file
        format: 'esm', // Output format (esm for ES Modules)
        sourcemap: true // Enable source maps
    },
    plugins: [
        resolve(), // Resolves node modules
        typescript() // Compiles TypeScript
    ],
    external: [
        "@google-cloud/firestore", // Avoid bundling Firestore, let Node.js handle it at runtime
        "express",
        "firebase-admin"
    ]

};