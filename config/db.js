const mongoose = require('mongoose');

const dbURI =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_PROD_URI
    : process.env.MONGO_DEV_URI || 'mongodb://localhost:27017/local_database';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB: ${dbURI}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;
