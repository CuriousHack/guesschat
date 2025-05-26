const state = require('../../models/gameState');

exports.addPlayer = (socketId, roomId, userName, role) => {
  if (role === 'player' && !state.rooms[roomId]) {
    state.userScores[userName] = 0;
    return { error: 'Room not found.' };
  }

  if (!state.rooms[roomId]) state.rooms[roomId] = [];
  state.rooms[roomId].push({ socketId, userName, role });
  return { room: state.rooms[roomId] };
};
