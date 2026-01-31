import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workouts.js';
import aiRoutes from './routes/ai.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payments.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'MyWorkout API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize database tables
    await initializeDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 MyWorkout Backend Server`);
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🤖 Groq AI: ${process.env.GROQ_API_KEY ? 'Configured ✅' : 'Not configured ❌'}`);
      console.log(`\n💪 API Endpoints:`);
      console.log(`   - Health: http://localhost:${PORT}/health`);
      console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
      console.log(`   - Workouts: http://localhost:${PORT}/api/workouts`);
      console.log(`   - AI Coach: http://localhost:${PORT}/api/ai`);
      console.log(`   - Users: http://localhost:${PORT}/api/users\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
