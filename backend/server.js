const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and then start server
const startServer = async () => {
  try {
    // Wait for MongoDB connection
    await connectDB();
    
    // Routes - load after MongoDB is connected
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/groups', require('./routes/group'));
    app.use('/api/expenses', require('./routes/expenses'));

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ message: 'Server is running' });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();