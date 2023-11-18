require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const helmet = require('helmet');
const morgan = require("morgan");
const usersRouter = require("./routes/users");
const invoicesRouter = require("./routes/invoices");
const notificationsRouter = require("./routes/notifications");
const bodyParser = require('body-parser');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


// Twilio endpoint for sending notifications
app.post('/api/notifications', (req, res) => {
  const { to, message } = req.body;

  client.messages
    .create({
      body: message,
      from: '+15203998681', // Replace with your Twilio phone number
      to: to
    })
    .then(message => res.json(message))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Stripe endpoint for handling payments
app.post('/api/invoices/:id/payment', async (req, res) => {
  const { id } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Amount in cents
      currency: 'usd',
      // Add more payment details as needed
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//set port
const PORT = process.env.PORT || 9000;

// Middleware to parse JSON bodies & log HTTP requests
app.use(morgan("dev"));
app.use(express.json());
// Enable All CORS Requests for development
app.use(cors());
// use helmet to set various HTTP headers for protecting against common vulnerabilities
app.use(helmet());

// Use routers
app.use("/api/users", usersRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/notifications", notificationsRouter);

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// middleware error handling
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
