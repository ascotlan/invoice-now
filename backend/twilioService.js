require("dotenv").config();
const twilio = require('twilio');

const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

const sendTwilioNotification = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: 'YOUR_TWILIO_PHONE_NUMBER',
      to: to,
    });
    console.log('Message sent:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

module.exports = { sendTwilioNotification };