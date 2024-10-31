const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const fs = require('fs');
const path = require('path');

// OAuth2 Credentials
const CLIENT_ID = '358811769009-srq02fehhptag5q9l5sebapa7obt0saq.apps.googleusercontent.com';
const CLIENT_SECRET = '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'; // REPLACE WITH THE CURRENT FUNCTIONAL CLIENT_SECRET
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

// Create an OAuth2 client with your credentials
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Load the refresh token from tokens.json
const TOKEN_PATH = path.join(__dirname, 'tokens.json');
let REFRESH_TOKEN = null;

// Function to read token from JSON file
const readRefreshToken = () => {
  try {
    const data = fs.readFileSync(TOKEN_PATH, 'utf8');
    const token = JSON.parse(data);
    REFRESH_TOKEN = token.refresh_token;
    return REFRESH_TOKEN;
  } catch (err) {
    console.error('Error reading refresh token from file:', err);
    throw err;
  }
};

// Function to update token in JSON file
const updateRefreshToken = (newToken) => {
  const tokenData = JSON.stringify({ refresh_token: newToken }, null, 2);
  fs.writeFileSync(TOKEN_PATH, tokenData, (err) => {
    if (err) {
      console.error('Error updating refresh token:', err);
      throw err;
    }
  });
  console.log('Refresh token updated successfully');
};

// Set the refresh token
oAuth2Client.setCredentials({ refresh_token: readRefreshToken() });

// Send email using Nodemailer
async function sendMail(to_email, subject, text) {
  try {

    // Generate a new access token
    const accessToken = await oAuth2Client.getAccessToken();

    // Check if the access token contains a new refresh token
    if (accessToken.res && accessToken.res.data && accessToken.res.data.refresh_token) {
      // Update the refresh token in storage
      updateRefreshToken(accessToken.res.data.refresh_token);
    }

    // Create a transporter object with OAuth2 configuration
    let transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., Gmail
      auth: {
        type: 'OAuth2',
        user: 'zezeh35@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token // Access token from OAuth2Client
      }
    });

    // Email options
    let mailOptions = {
      from: 'zezeh35@gmail.com',
      to: to_email,
      subject: subject,
      text: text,
    };

    // Send the email
    let result = await transporter.sendMail(mailOptions);
    return result
  } catch (error) {
    console.log('Error sending email:', error);
    throw error
  }
}

exports.sendMail = sendMail