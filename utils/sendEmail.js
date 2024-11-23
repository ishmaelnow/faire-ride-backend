const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY, // Your Mailgun API key
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: 'your_email@domain.com',
      to,
      subject,
      text,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
