const express = require('express');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const port = process.env.PORT || 3000;

// Configurar o diretório onde estão os arquivos estáticos
const staticPath = path.join(__dirname, 'dist');
app.use(express.static(staticPath, { 'extensions': ['html'] }));

// Rota para servir o arquivo index.html
app.get('/', (_, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Configurar o Socket.IO
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Lidar com eventos do Socket.IO aqui
});

// Inicia o servidor
server.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
