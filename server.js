require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const driverRoutes = require('./routes/driverRoutes');

const app = express();

// Debugging Middleware for Logging Requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS Configuration
const allowedOrigins = [
  'https://inquisitive-blancmange-95431a.netlify.app', // Frontend production URL
  'http://localhost:3000', // Local development frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests from allowed origins
      } else {
        callback(new Error('CORS policy: This origin is not allowed.'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials like cookies
  })
);

// Middleware: Parse JSON bodies
app.use(bodyParser.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/rides', rideRoutes); // Ride management routes
app.use('/api/drivers', driverRoutes); // Driver management routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
