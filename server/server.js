require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

});

// Middleware



// API Routes
app.use('/auth', require('./routes/auth'));
app.use('/boards', require('./routes/boards'));
// app.use('/lists', require('./routes/lists'));
// app.use('/cards', require('./routes/cards'));




// 
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
