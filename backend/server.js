const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/dispatcher', require('./routes/dispatcherRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/compliance', require('./routes/complianceRoutes'));
app.use('/api/freight', require('./routes/freightRoutes'));
app.use('/api/blockchain', require('./routes/blockchainRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// WebSocket for real-time collaboration
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (room) => {
        socket.join(room);
    });

    socket.on('dock-update', (data) => {
        socket.broadcast.emit('dock-status-changed', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`OptiLogix server running on port ${PORT}`);
});