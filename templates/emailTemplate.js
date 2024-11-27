const React = require('react');
const { Html } = require('@react-email/html');
const { Button } = require('@react-email/button');

function EmailTemplate({ url }) {
    return React.createElement(
        Html,
        { lang: 'en' },
        React.createElement('h1', null, 'Thank you for booking with Fare Ride!'),
        React.createElement('p', null, 'Click the button below to view your booking details:'),
        React.createElement(Button, { href: url }, 'View Ride Details')
    );
}

module.exports = { EmailTemplate };
