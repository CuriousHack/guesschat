const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const socketInit = require('./gaming/sockets');
const dotenv = require('dotenv');
const { generateCode } = require('./utils/helpers');
const gameState = require('./models/gameState');

dotenv.config();

const server = http.createServer(app);
const io = new Server(server);
socketInit(io);


app.post('/api/save-questions', async (req, res) => {
  const response = req.body
  questions = response.questions
  gameState.savedQuestions = questions
  const code = generateCode();
  response.code = code;
  res.status(201).json({ message: 'Questions submitted successfully', data: response });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
