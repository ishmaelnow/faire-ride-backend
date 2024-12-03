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

// CORS configuration
const publicRoutes = ['/api/rides']; // List of public routes
const privateRoutes = ['/api/rides/admin-register', '/api/drivers', '/api/auth/login']; // Restricted routes
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://your-frontend-domain.com', // Production frontend
];

app.use((req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    // Allow all origins for public routes
    cors()(req, res, next);
  } else if (privateRoutes.includes(req.path)) {
    // Restrict origins for private routes
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    })(req, res, next);
  } else {
    // Proceed to the next middleware if the route is not explicitly listed
    next();
  }
});

// Configure Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https:"],
        connectSrc: ["'self'", "https://fare-backend-72dcc5cb3edd.herokuapp.com"],
      },
    },
  })
);

// Protect against XSS attacks
app.use(xss());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(limiter);

// Import API routes
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const rideRoutes = require('./routes/rideRoutes'); // Ride routes
const driverRoutes = require('./routes/driverRoutes'); // Driver routes
const adminRoutes = require('./routes/adminRoutes'); // Admin routes
const authMiddleware = require('./middleware/authMiddleware'); // Authentication middleware

// Prefix API routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/rides', rideRoutes); // Public booking routes
app.use('/api/drivers', authMiddleware, driverRoutes); // Protect drivers with authMiddleware
app.use('/api/admin', authMiddleware, adminRoutes); // Protect admin routes with authMiddleware

// Serve static files from the public folder (e.g., favicon.ico)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the custom index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
