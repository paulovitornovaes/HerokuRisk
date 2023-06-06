// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copySync } from 'fs-extra';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: '', // Manter os assets na raiz do diretório de saída
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Caminho para o seu index.html na raiz do projeto
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    onEnd: () => {
      copySync('public', 'dist'); // Copiar todos os arquivos da pasta public para a pasta dist
    },
  },
});
