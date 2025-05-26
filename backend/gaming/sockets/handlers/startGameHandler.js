const gameController = require('../../controllers/gameController');

module.exports = (io, socket) => {
  socket.on('startGame', (roomId) => {
    gameController.handleStartGame(io, socket, roomId);
  });
};
