import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    // Allows using React dev server along with building a React application with Vite.
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    // Allows using self-signed certificates to run the dev server using HTTPS.
    //https://www.npmjs.com/package/@vitejs/plugin-basic-ssl
    basicSsl(),
  ],
  publicDir: './public',
  build: {
    outDir: 'dist', // Ensure output directory is 'dist'
    assetsDir: 'assets', // Assets will be in dist/assets/
    sourcemap: false, // Optional: disable sourcemaps for production
  },
  server: {
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: false,
    https: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://gamehub-production-416a.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // Keep /api in the path
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), './src'),
    }
  },
});