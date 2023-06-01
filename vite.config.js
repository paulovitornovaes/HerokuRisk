// vite.config.js
import path from 'path';

export default  {
    root: './public', // diretório raiz do projeto
    build: {
        outDir: path.resolve(__dirname, './dist'), // Diretório de saída dos arquivos construídos (pasta acima de "public")
    }
  };
  