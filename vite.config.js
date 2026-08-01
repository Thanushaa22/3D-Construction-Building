import { defineConfig } from 'vite';
export default defineConfig({
  root: '.',
  base: '/3D-Construction-Building/',
  publicDir: 'public',
  server: { port: 3000, open: false },
  build: { outDir: 'dist', sourcemap: false }
});
