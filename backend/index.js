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
  // console.log(JSON.stringify(response, null, 2));
  const code = generateCode();
  response.code = code;
  res.status(201).json({ message: 'Questions submitted successfully', data: response });
})






// Handle socket.io connection
io.on('connection', (socket) => {
    console.log('👤 New user connected');
  
    socket.on("joinRoom", ({ roomId, username, role }) => {
      if (role === "player" && !rooms[roomId]) {
        socket.emit("error", "Room not found.");
        return;
      }
    
      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = [];
    
      rooms[roomId].push({ socketId: socket.id, username, role });
      io.to(roomId).emit("playerListUpdate", rooms[roomId]);
    });


    socket.on("startGame", (roomId) => {
      const roomPlayers = rooms[roomId];
      if (!roomPlayers || roomPlayers.length < 3) {
        io.to(socket.id).emit("error", "At least 3 players required.");
        return;
      }

      const host = roomPlayers.find(p => p.socketId === socket.id && p.role === "master");
      if (!host) return;

      io.to(roomId).emit("gameStarted", roomId);
    });

    
  
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

connectDb();
server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})