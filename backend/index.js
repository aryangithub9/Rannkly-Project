import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/Db.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/Auth.Route.js';
app.use('/api/v1/auth', authRoutes);
import taskRoutes from './routes/Task.Route.js';
app.use('/api/v1/tasks', taskRoutes);
import userRoutes from './routes/User.Route.js';
app.use('/api/v1/users', userRoutes);

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});