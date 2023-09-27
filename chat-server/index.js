const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:3000", // 允许来自 localhost:3000 的跨源请求
  methods: ["GET", "POST"]
};

const io = socketIo(server, { cors: corsOptions });

const PORT = 7007;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const users = {};

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('setUsername', (username) => {
    users[socket.id] = username;
    console.log(`${username} connected`);
  });

  socket.on('message', (data) => {
    const userMessage = {
      username: users[socket.id],
      message: data,
    };
    io.emit('message', userMessage);
  });

  socket.on('disconnect', () => {
    console.log(`${users[socket.id]} disconnected`);
    delete users[socket.id];
  });
});

