const React = require('react'); // Import React
const ReactDOMServer = require('react-dom/server'); // Use ReactDOMServer for rendering
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
const { EmailTemplate } = require('../templates/emailTemplate'); // Import the email template

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

        // Validate environment variables
        if (!process.env.MAILERSEND_FROM_EMAIL || !process.env.MAILERSEND_FROM_NAME) {
            throw new Error('Missing sender email or name in environment variables.');
        }

        // Render the email template to static HTML
        const emailHtml = ReactDOMServer.renderToStaticMarkup(
            React.createElement(EmailTemplate, { url })
        );

        // Ensure the rendered HTML is a string
        if (typeof emailHtml !== 'string') {
            throw new Error('Rendered HTML is not a string.');
        }

        // Fallback plain-text content
        const emailText = `Thank you for booking with Fare Ride! View your booking details here: ${url}`;

        // Define sender and recipient
        const sentFrom = new Sender(
            process.env.MAILERSEND_FROM_EMAIL, // Use sender email from environment variables
            process.env.MAILERSEND_FROM_NAME  // Use sender name from environment variables
        );

        const recipients = [new Recipient(to, "Recipient Name")];

        // Create email parameters
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setHtml(emailHtml) // Add HTML content
            .setText(emailText); // Add plain-text content

        // Send email
        const response = await mailerSend.email.send(emailParams);
        console.log('Email sent successfully!', response.body);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
}

module.exports = sendEmail;
