const express = require("express");
const router = express.Router();
const twilio = require('twilio');

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Create Twilio client
const client = twilio(accountSid, authToken);


// Fetch all notifications by user ID
router.get("/", async (req, res, next) => {
  try {
    // get notifications logic
    res.send("All notifications");
  } catch (err) {
    next(err);
  }
});

// Create a notification for a user
router.post("/", async(req, res, next) => {
  try {
    const { phoneNumber, message } = req.body;

    const sentMessage = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, //Twilio phone number
      to: process.env.TWILIO_CUSTOMER || phoneNumber,
    });

    console.log("SMS Sent:", sentMessage.sid);
    res.status(200).json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send SMS" });
    next(error);
  }
});

module.exports = router;
