const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Import the Message model
const sendEmail = require('../services/sendEmail'); // Import MailerSend email service

// POST: Submit a customer message
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Save the message to the database
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // Notify the admin about the new message
    await sendEmail({
      to: process.env.MAILERSEND_FROM_EMAIL, // Notify the admin using the existing FROM email
      subject: 'New Contact Form Submission',
      url: `http://yourapp.com/admin-dashboard/messages`, // Adjust for your admin dashboard URL
    });

    // Send a confirmation email to the customer
    await sendEmail({
      to: email,
      subject: 'We Received Your Message',
      url: `http://yourapp.com/thank-you`, // Adjust for your customer-facing thank-you page
    });

    res.status(201).json({ message: 'Message submitted successfully!' });
  } catch (error) {
    console.error('Error handling message submission:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
