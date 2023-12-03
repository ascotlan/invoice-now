const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();

router.post('/create-payment-intent', async(req, res, next) => {
  const { paymentMethodId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // Replace with the appropriate currency
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {enabled: true, allow_redirects: "never" },
    });

    // Handle successful payment, update your database, etc.
    // Send success response back to the frontend
    res.status(200).json({ message: 'Payment succeeded!' });
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
    next(error);
  }
});

module.exports = router;