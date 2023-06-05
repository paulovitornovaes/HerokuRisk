// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copy } from 'fs-extra';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'), // Caminho para o seu index.html dentro da pasta src
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    onEnd: () => {
      copy('src', 'dist'); // Copiar todos os arquivos estáticos da pasta src para a pasta dist
    },
  },
});
