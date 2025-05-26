const gameController = require('../../controllers/gameController');

module.exports = (io, socket) => {
  socket.on('gameChat', ({ roomId, message, userName }) => {
    gameController.handleGameChat(io, roomId, message, userName);
  });
};
