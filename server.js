require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet'); // For setting HTTP headers
const xss = require('xss-clean'); // For preventing XSS attacks
const rateLimit = require('express-rate-limit'); // For rate limiting

// Import routes
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes'); // Ride management routes
const bookingRoutes = require('./routes/bookingRoutes'); // Booking routes
const driverRoutes = require('./routes/driverRoutes'); // Driver management routes
const adminDashboardRoutes = require('./routes/adminDashboardRoutes'); // Admin dashboard routes
const customerDashboardRoutes = require('./routes/customerDashboardRoutes'); // Customer dashboard routes
const contactRoutes = require('./routes/contactRoutes'); // Contact routes

const app = express();

// Security: Set HTTP headers
app.use(helmet());

// Security: Prevent XSS attacks
app.use(xss());

// Rate Limiting: Limit requests to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Debugging Middleware for Logging Requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Debugging Route to Check Environment Variables
app.get('/env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    //MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000,
  });
});

// CORS Configuration
const allowedOrigins = [
  'https://inquisitive-blancmange-95431a.netlify.app', // Replace with your production frontend URL
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

// Enhanced Database Connection Logic
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //console.log('Connected to MongoDB');
    //console.log('MongoDB URI:', process.env.MONGO_URI); // Log the URI being used
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit the process if the database connection fails
  });

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/rides', rideRoutes); // Ride management routes
app.use('/api/bookings', bookingRoutes); // Booking routes
app.use('/api/drivers', driverRoutes); // Driver management routes
app.use('/api/dashboard/admin', adminDashboardRoutes); // Admin dashboard routes
app.use('/api/dashboard/customer', customerDashboardRoutes); // Customer dashboard routes
app.use('/api/contact', contactRoutes); // Contact routes

// Root Route (Optional)
app.get('/', (req, res) => {
  res.send('Welcome to the Fare Ride App backend!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Node Environment: ${process.env.NODE_ENV}`);
});
