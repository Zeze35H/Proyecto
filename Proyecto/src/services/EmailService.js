const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// OAuth2 Credentials
const CLIENT_ID = '358811769009-srq02fehhptag5q9l5sebapa7obt0saq.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04uuPIVlNH_y2CgYIARAAGAQSNwF-L9IrjZ2W2ULr-CbpRH_0acMsN8mE1djfv7OtXeLQLy78cinE18sI-_mfnqA7pZoGs1Nw1JU';

// Create an OAuth2 client with your credentials
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Set the refresh token
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Send email using Nodemailer
async function sendMail(to_email, subject, text) {
  try {

    // Generate a new access token
    const accessToken = await oAuth2Client.getAccessToken();

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
    return error
  }
}

exports.sendMail = sendMail