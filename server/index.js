import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import channelRoutes from './routes/channels.js';
import forexRoutes from './routes/forex.js';
import { joinChannel, leaveChannel } from './controllers/channelController.js';
import { updatePrices } from './controllers/forexController.js';
import { socketAuth } from './middleware/socketAuth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with CORS configuration
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.VITE_CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.VITE_CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/forex', forexRoutes);

// Socket.io middleware
io.use(socketAuth);

// Socket.io events
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id} (${socket.user.email})`);

  socket.on('joinChannel', (channelId) => {
    joinChannel(socket.user, channelId);
    socket.join(channelId);
    console.log(`👥 Client ${socket.id} joined channel: ${channelId}`);
  });

  socket.on('leaveChannel', (channelId) => {
    leaveChannel(socket.user, channelId);
    socket.leave(channelId);
    console.log(`👋 Client ${socket.id} left channel: ${channelId}`);
  });

  socket.on('newMessage', (data) => {
    io.to(data.channelId).emit('message', {
      ...data,
      user: socket.user.email
    });
    console.log(`💬 New message in channel: ${data.channelId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const updateInterval = setInterval(() => updatePrices(io), 5000);

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  clearInterval(updateInterval);
  httpServer.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});