const joinRoomHandler = require('./handlers/joinRoomHandler.js');
const startGameHandler = require('./handlers/startGameHandler.js');
const gameChatHandler = require('./handlers/gameChatHandler.js');
const startQueHandler = require('./handlers/startQueHandler.js');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    joinRoomHandler(io, socket);
    startGameHandler(io, socket);
    gameChatHandler(io, socket);
    startQueHandler(io, socket);

    socket.on('disconnect', () => {
      console.log('🚪 Socket disconnected:', socket.id);
    });
  });
};
