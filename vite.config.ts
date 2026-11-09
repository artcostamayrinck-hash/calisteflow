import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __root = fileURLToPath(new URL('.', import.meta.url));

function versionedServiceWorkerPlugin() {
  return {
    name: 'versioned-service-worker',
    closeBundle() {
      const swDistPath = path.resolve(__root, 'dist/sw.js');
      if (fs.existsSync(swDistPath)) {
        let content = fs.readFileSync(swDistPath, 'utf-8');
        const buildHash = Date.now().toString(36);
        const cacheVersion = `calisteflow-v4.2.0-${buildHash}`;
        content = content.replace(/const CACHE_NAME = ['"][^'"]+['"];/, `const CACHE_NAME = '${cacheVersion}';`);
        fs.writeFileSync(swDistPath, content, 'utf-8');
        console.log(`[SW-Plugin] Injected versioned CACHE_NAME: ${cacheVersion}`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify('4.2.0'),
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [react(), tailwindcss(), versionedServiceWorkerPlugin()],
});
