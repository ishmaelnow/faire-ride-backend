const path = require('path'); // For handling file paths
const express = require('express'); // For creating the server
const mongoose = require('mongoose'); // For MongoDB connection
const dotenv = require('dotenv'); // For loading environment variables
const cors = require('cors'); // For handling CORS

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON requests

// Import API routes
const rideRoutes = require('./routes/rideRoutes');
const driverRoutes = require('./routes/driverRoutes');

// Prefix API routes
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);

// Serve the React frontend build in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(buildPath));

  // Handle React routing by sending `index.html` for any unknown routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
} else {
  console.log('Running in development mode');
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Add a simple root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Fare Backend API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
