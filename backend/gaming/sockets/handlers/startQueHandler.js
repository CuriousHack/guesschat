const gameController = require('../../controllers/gameController');

module.exports = (io, socket) => {
  socket.on('startQue', () => {
    gameController.handleStartQue(io, socket);
  });
};
