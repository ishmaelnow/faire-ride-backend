const path = require('path'); // For handling file paths
const express = require('express'); // For creating the server
const mongoose = require('mongoose'); // For MongoDB connection
const dotenv = require('dotenv'); // For loading environment variables
const cors = require('cors'); // For handling CORS
const helmet = require('helmet'); // For setting security headers
const rateLimit = require('express-rate-limit'); // For limiting repeated requests
const xss = require('xss-clean'); // For sanitizing user inputs

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware to handle CORS
app.use(cors());

// Configure Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"], // Allow images from the same origin, data URIs, and HTTPS
        scriptSrc: ["'self'"], // Allow scripts from the same origin
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (Bootstrap requires this)
        fontSrc: ["'self'", "https:"], // Allow fonts from the same origin and HTTPS
        connectSrc: ["'self'", "https://fare-backend-72dcc5cb3edd.herokuapp.com"], // Allow API connections
      },
    },
  })
);

// Protect against XSS attacks
app.use(xss());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 25 * 60 * 1000, // 15-minute window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(limiter);

// Import API routes
const rideRoutes = require('./routes/rideRoutes');
const driverRoutes = require('./routes/driverRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes

// Prefix API routes
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/admin', adminRoutes); // Prefix for admin routes

// Serve static files from the public folder (e.g., favicon.ico)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the custom index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
