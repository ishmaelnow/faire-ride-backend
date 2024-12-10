const React = require('react'); // Import React
const ReactDOMServer = require('react-dom/server'); // For rendering React components to static HTML
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
const { EmailTemplate } = require('../templates/emailTemplate'); // Email template

// Initialize MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

async function sendEmail({ to, subject, url }) {
  try {
    // Validate required parameters
    if (!to || !subject || !url) {
      throw new Error('Missing required email parameters: to, subject, or url.');
    }

    if (!process.env.MAILERSEND_FROM_EMAIL || !process.env.MAILERSEND_FROM_NAME) {
      throw new Error('Missing sender email or name in environment variables.');
    }

    // Render the email template
    const emailHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(EmailTemplate, { url })
    );

    // Fallback plain-text content
    const emailText = `Thank you for booking with Fare Ride! View your booking details here: ${url}`;

    // Define sender and recipient
    const sentFrom = new Sender(
      process.env.MAILERSEND_FROM_EMAIL,
      process.env.MAILERSEND_FROM_NAME
    );
    const recipients = [new Recipient(to, 'Recipient')];

    // Set up email parameters
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(emailHtml)
      .setText(emailText);

    // Send email
    const response = await mailerSend.email.send(emailParams);
    console.log('Email sent successfully:', response.body);
    return response;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}

module.exports = sendEmail;
