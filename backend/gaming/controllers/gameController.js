const gameService = require('../services/gameServices');
const state = require('../../models/gameState');


const handleJoinRoom = (io, socket, { roomId, userName, role }) => {
  const result = gameService.addPlayer(socket.id, roomId, userName, role);

  if (result.error) {
    return socket.emit('error', result.error);
  }

  socket.join(roomId);
  io.to(roomId).emit('playerListUpdate', result.room);
};

const handleStartQue = (io, socket) => {
  const {
    savedQuestions,
    currentQuestionIndex,
    roomCode,
  } = require('../../models/gameState');
  
    const current = savedQuestions[currentQuestionIndex];
  
    if (!current) return;
  
    io.to(roomCode).emit('question', {
      username: 'GuessChat',
      question: current.question,
      options: current.options,
    });
  
    current.answered = false;
  
    
    clearTimeout(state.timer); // clear previous if any
  
    state.timer = setTimeout(() => {
      if (!current.answered) {
        io.to(roomCode).emit('chatMsg', {
          message: `No correct answer! Correct was ${current.correctAnswer}`,
          userName: 'GuessChat',
        });
  
        setTimeout(() => {
          nextQuestion(io);
        }, 5000);
      }
    }, 30000); // 30 seconds
  };

  
  const nextQuestion = (io) => {
    
    const {
      savedQuestions,
      userScores,
      roomCode,
    } = state;
  
    state.currentQuestionIndex++;
  
    if (state.currentQuestionIndex >= state.savedQuestions.length) {
      io.to(roomCode).emit('end', userScores);
      return;
    }
  
    const current = savedQuestions[state.currentQuestionIndex];
    current.answered = false;
  
    io.to(roomCode).emit('question', {
      username: 'GuessChat',
      question: current.question,
      options: current.options,
    });
  
    clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      if (!current.answered) {
        nextQuestion(io);
      }
    }, 10000);
  };
  

  const handleStartGame = (io, socket, roomId) => {
    
    const roomPlayers = state.rooms[roomId];
  
    if (!roomPlayers || roomPlayers.length < 3) {
      io.to(roomId).emit('error', "At least 3 players required.");
      console.log('3 players required')
      return;
    }
  
    const host = roomPlayers.find(p => p.socketId === socket.id && p.role === 'master');
    if (!host) return;
  
    state.roomCode = roomId;
    state.currentQuestionIndex = 0;
    state.userScores = {};
    state.savedQuestions.forEach(q => (q.answered = false));
  
    io.to(roomId).emit('gameStarted', roomId);
  };

  const handleGameChat = (io, roomId, message, userName) => {
    
  
    // Emit the original chat message (uppercased)
    io.to(roomId).emit('chatMsg', {
      message: message.toUpperCase(),
      userName,
    });
  
    // Check answer
    const current = state.savedQuestions[state.currentQuestionIndex];
    if (!current) return;
  
    if (message == current.correctAnswer && !current.answered) {
      current.answered = true;
  
      if (!state.userScores[userName]) {
        state.userScores[userName] = 0;
      }
      state.userScores[userName] += 10;
  
      io.to(roomId).emit('chatMsg', {
        message: `${userName} got it right! +10 points`,
        userName: 'GuessChat',
      });
  
      clearTimeout(state.timer);
      setTimeout(() => {
        nextQuestion(io);
      }, 5000);
    } else if (!current.answered) {
      io.to(roomId).emit('chatMsg', {
        message: `${userName} got it wrong!`,
        userName: 'GuessChat',
      });
    }
  };

module.exports = {
  handleJoinRoom,
  handleStartQue,
  nextQuestion,
  handleStartGame,
  handleGameChat
}
  