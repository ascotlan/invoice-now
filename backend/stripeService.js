require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

const initiateStripePayment = async (amount, source, description) => {
  // Input validation
  if (!Number.isInteger(amount) || amount <= 0) {
    const error = new Error('Invalid amount');
    logger.error('Invalid amount:', error);
    throw error;
  }

  try {
    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: source,
      description: description,
    });
    logger.info('Charge created:', charge.id);
    return charge;
  } catch (error) {
    logger.error('Error creating charge:', error);
    throw error;
  }
};

module.exports = { initiateStripePayment };
