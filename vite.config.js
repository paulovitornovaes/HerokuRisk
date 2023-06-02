// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copy } from 'fs-extra';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'), // Caminho para o seu index.html dentro da pasta public
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    onEnd: () => {
      copy('public', 'dist'); // Copiar todos os arquivos estáticos da pasta public para a pasta dist
    },
  },
});
