const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Driver = require('./models/Driver');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Connected');
    const drivers = [
      { name: 'Alice', phone: '123-456-7890', email: 'alice@example.com' },
      { name: 'Bob', phone: '987-654-3210', email: 'bob@example.com' },
      { name: 'Charlie', phone: '555-666-7777', email: 'charlie@example.com' },
    ];
    await Driver.insertMany(drivers);
    console.log('Drivers seeded');
    mongoose.connection.close();
  })
  .catch((err) => console.error('MongoDB Error:', err));
