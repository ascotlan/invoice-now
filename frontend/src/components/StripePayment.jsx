import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const StripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }


    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Send paymentMethod.id to your server
      const response = await axios.post('http://localhost:9000/api/payments', {
        paymentMethodId: paymentMethod.id,
        amount: 2000, // Replace with the actual amount
        // Add other necessary details for the payment
      });

      // Handle success
      console.log('Payment successful:', response.data);
    } catch (error) {
      setPaymentError(error.message);
      console.error('Payment error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {paymentError && <div>{paymentError}</div>}
    </form>
  );
};

export default StripePayment;