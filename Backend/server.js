// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import axios from 'axios';
dotenv.config();
const allowedOrigin = process.env.FRONTEND_URL || '*';
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
  },
});

connectDB();

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running on 5000  ',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Background AI warm-up
  if (process.env.AI_SERVICE_URL) {
    const baseUrl = process.env.AI_WARM_URL;

    setTimeout(() => {
      axios
        .get(baseUrl)
        .then(() => {
          console.log('AI warm-up successful.');
        })
        .catch((err) => {
          console.log('AI warm-up error:', err.message);
        });
    }, 2000); // 2 second delay after startup
  }
});

import errorHandler from './middleware/errorHandler.js';
app.use(errorHandler);
