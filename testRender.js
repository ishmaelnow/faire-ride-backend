const React = require('react');
const ReactDOMServer = require('react-dom/server'); // Use ReactDOMServer
const { EmailTemplate } = require('./templates/emailTemplate'); // Adjust the path if necessary

const testRender = () => {
    try {
        const url = "http://localhost:3000/ride/test-id";
        const emailHtml = ReactDOMServer.renderToStaticMarkup(
            React.createElement(EmailTemplate, { url })
        );

        console.log('Rendered HTML:', emailHtml);
        console.log('Type of Rendered Output:', typeof emailHtml);
    } catch (error) {
        console.error('Error during render:', error);
    }
};

testRender();
