const gameController = require('../../controllers/gameController');

module.exports = (io, socket) => {
  socket.on('joinRoom', (payload) => {
    gameController.handleJoinRoom(io, socket, payload);
  });
};
