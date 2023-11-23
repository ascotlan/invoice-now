require("dotenv").config();
const twilio = require('twilio');
const express = require('express');
const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post('/', async (req, res) => {
  try {
    const invoice = req.body;

    const {
      invoiceId,
      paymentDue,
      customerName,
      total
    } = invoice;

    // Compose the SMS message using invoice details
    const message = `Hello ${customerName},\nThis is a friendly reminder that your invoice (${invoiceId}) with a total amount of $${total} is due on ${paymentDue}. Thank you!`;

    // Replace with your actual Twilio phone number and recipient's phone number
    const from = '+15203998681';
    const to = '+3065021204';

    // Use Twilio's API to send an SMS to the customer
    const twilioResponse = await client.messages.create({
      body: message,
      from: from,
      to: to
    });

    console.log(`Message SID: ${twilioResponse.sid}`);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Failed to send message');
  }
});

module.exports = router;
