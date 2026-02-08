require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const corsOptions = {
    origin: `${process.env.CLIENT_URL || 'http://localhost:3000'}`,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: corsOptions
});

app.use(cors(corsOptions));
app.use(express.json());

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('join_board', (boardId) => {
        socket.join(boardId);
        console.log(`User ${socket.id} joined board ${boardId}`);
    })

    socket.on('leave_board', (boardId) => {
        socket.leave(boardId);
        console.log(`User ${socket.id} left board ${boardId}`);
    })

    socket.on('task_move', (boardId) => {
        socket.to(boardId).emit('task_move');
        console.log(`User ${socket.id} move task in board ${boardId}`);
    })

    socket.on('update_task', ({boardId, cardId}) => {
        socket.to(boardId).emit('update_task', cardId);
        console.log(`User ${socket.id} update task in board ${boardId}`);
    })
});

// API Routes
app.use('/auth', require('./routes/auth'));
app.use('/boards', require('./routes/boards'));
app.use('/users', require('./routes/users'));




// 
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
