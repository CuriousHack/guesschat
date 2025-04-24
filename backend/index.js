const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session')
const path = require('path');
const authRoute = require('./authentication/routes/AuthRoutes')
const connectDb = require('./utils/db')
const { Server } = require('socket.io');
const sharedSession = require("express-socket.io-session");
const http = require("http");
const { generateCode } = require('./utils/helpers');
const authMiddleware = require('./middleware/authMiddleware');
let savedQuestions = [];
const userScores = {};
let currentQuestionIndex = 0;
let timer = null;
let roomCode = "";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);
const rooms = {};

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "../frontend")))

//session setup
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
});
app.use(sessionMiddleware);

io.use(sharedSession(sessionMiddleware, { autoSave: true }));
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});


app.use('/auth', authRoute)

app.post('/api/save-questions', (req, res) => {
  const response = req.body
  savedQuestions = response.questions
  const code = generateCode();
  response.code = code;
  res.status(201).json({ message: 'Questions submitted successfully', data: response });
})


// Handle socket.io connection
io.on('connection', (socket) => {
    console.log('👤 New user connected');
  
    socket.on("joinRoom", ({ roomId, userName, role }) => {
      if (role === "player" && !rooms[roomId]) {
        userScores[userName] = 0;
        socket.emit("error", "Room not found.");
        
        return;
      }
    
      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = [];
    
      rooms[roomId].push({ socketId: socket.id, userName, role });
      io.to(roomId).emit("playerListUpdate", rooms[roomId]);
    });


    socket.on("startGame", (roomId) => {
      const roomPlayers = rooms[roomId];
      if (!roomPlayers || roomPlayers.length < 3) {
        io.to(roomId).emit("error", "At least 3 players required.");
        return;
      }

      const host = roomPlayers.find(p => p.socketId === socket.id && p.role === "master");
      if (!host) return;
      roomCode = roomId;

      io.to(roomId).emit("gameStarted", roomId);
    });

    socket.on("gameChat", ({ roomId, message, userName }) => {

      //perform other actions here
      const chatData = {
        message: message.toUpperCase(),
        userName
      }
      io.to(roomId).emit("chatMsg", chatData);
      answer({ roomId, message, userName})
    });

    function answer({roomId, userName, message}){
      const current = savedQuestions[currentQuestionIndex];
      if (!current) return;
  
      if (message === current.correctAnswer && !current.answered) {
        current.answered = true;
        userScores[userName] += 10;
        const chatData = {
          message: `${userName} got it right! +10 points`,
          userName: "GuessChat"
        }
        io.to(roomId).emit("chatMsg", chatData);
  
        clearTimeout(timer);
        setTimeout(() => {
          nextQuestion();
        }, 5000);
      }
      else{
        current.answered = false;

        const chatData = {
          message: `${userName} got it wrong!`,
          userName: "GuessChat"
        }
        io.to(roomId).emit("chatMsg", chatData);
      }
    }

    function nextQuestion() {
      currentQuestionIndex++;
      if (currentQuestionIndex >= savedQuestions.length) {
        io.to(roomCode).emit("end", userScores);
        return;
      }
    
      const current = savedQuestions[currentQuestionIndex];
      current.answered = false;
    
      io.to(roomCode).emit("question", {
        username: "GuessChat",
        question: current.question,
        options: current.options
      });
    
      timer = setTimeout(() => {
        if (!current.answered) {
          nextQuestion();
        }
      }, 10000); // 10 seconds
    }
    

    socket.on("startQue", () => {
      //emit question
      const current = savedQuestions[currentQuestionIndex];
        io.to(roomCode).emit("question", {
          username: "GuessChat",
          question: current.question,
          options: current.options
        });
        
        timer = setTimeout(() => {
          if (!current.answered) {
            const chatData = {
              message: `No correct answer! Correct was ${current.correctAnswer}`,
              userName: 'GuessChat'
            }
            io.to(roomCode).emit("chatMsg", chatData);
            setTimeout(() => {
              nextQuestion();
            }, 5000);
          }
        }, 30000);
      }, 1000);

    
  
    socket.on('disconnect', () => {
      console.log('👋 User disconnected');
    });
  });
  app.post('/api/check', (req, res) => {
    const response = req.body
    const code = response.code
    try{
      if(code){
        if(findSessionById(code)){
        res.status(200).json( { message: 'session found' });
        }
        else{
          res.status(400).json( {message: 'session not found'})
        }
      }
      
    }
    catch(err){
      console.log(err)
      res.status(500).json({ message: err})
    }
  })

// connectDb();
server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})