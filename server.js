// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

let rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createRoom', (roomId) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [socket.id], gameState: Array(9).fill('') };
      socket.join(roomId);
      socket.emit('roomCreated', { roomId });
    } else {
      socket.emit('error', 'Room already exists.');
    }
  });

  socket.on('joinRoom', (roomId) => {
    if (rooms[roomId] && rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(socket.id);
      socket.join(roomId);
      io.in(roomId).emit('startGame', { message: 'Both players joined. Start playing!', gameState: rooms[roomId].gameState });
    } else {
      socket.emit('error', 'Room full or does not exist.');
    }
  });

  socket.on('makeMove', ({ roomId, index, mark }) => {
    if (rooms[roomId]) {
      rooms[roomId].gameState[index] = mark;
      io.in(roomId).emit('moveMade', { gameState: rooms[roomId].gameState });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Remove user from rooms and cleanup
    for (let roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);
      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});
