// server.js
const http = require('http');
const socketIO = require('socket.io');

const httpServer = http.createServer();
const io = socketIO(httpServer);

module.exports = { httpServer, io };
