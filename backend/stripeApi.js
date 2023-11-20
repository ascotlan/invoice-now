const stripe = require('stripe')('REACT_APP_STRIPE_SECRET_KEY');

app.post('/api/payments', async (req, res) => {
  const { paymentMethodId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // Replace with the appropriate currency
      payment_method: paymentMethodId,
      confirm: true,
    });

    // Handle successful payment, update your database, etc.
    // Send success response back to the frontend
    res.status(200).json({ message: 'Payment succeeded!' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});
