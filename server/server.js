require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const redisWriteBackService = require('./services/redisWriteBackService');

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

const redisClient = createClient({ url: 'redis://localhost:6379' });
const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/auth', require('./routes/auth'));
app.use('/boards', require('./routes/boards'));
app.use('/users', require('./routes/users'));
app.use('/repositories', require('./routes/github'))

// 

async function startServer() {
    try {
        await Promise.all([
            redisClient.connect(),
            pubClient.connect(),
            subClient.connect()
        ]);

        await redisWriteBackService.init(redisClient);
        redisWriteBackService.startBatchProcessor(5000);

        io.adapter(createAdapter(pubClient, subClient));

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

            socket.on('task_move', ({ boardId, taskId, sourceCardId, destCardId, prevIndex, newIndex }) => {
                socket.to(boardId).emit('task_move', { taskId, sourceCardId, destCardId, prevIndex, newIndex });
                console.log(`User ${socket.id} move task in board ${boardId}`);
            })

            socket.on('update_task', ({ boardId, cardId, taskId, status }) => {
                socket.to(boardId).emit("update_task", { cardId, taskId, status });
                console.log(`User ${socket.id} update task in board ${boardId}`);
            })

            socket.on('update_task_name_desc', ({ boardId, cardId, taskId, name, description }) => {
                socket.to(boardId).emit("update_task_name_desc", { cardId, taskId, name, description });
            })

            socket.on('update_card_name_desc', ({ boardId, cardId, name, description }) => {
                socket.to(boardId).emit("update_card_name_desc", { cardId, name, description });
            })
        });

        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();