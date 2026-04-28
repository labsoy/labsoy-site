import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
    base,
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: "main.js",
            },
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: "./src/test/setupTests.js",
        globals: true,
    },
});