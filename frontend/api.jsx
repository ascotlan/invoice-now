import React, { useState } from 'react';
import { TwilioAPI, StripeAPI } from './Api';

const Api = () => {
  const [loading, setLoading] = useState(false);

  const sendTwilioNotification = async () => {
    try {
      setLoading(true);
      // Replace TwilioAPI.sendMessage with your Twilio API call using the library
      await TwilioAPI.sendMessage(/* message data */);
      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const initiateStripePayment = async () => {
    try {
      setLoading(true);
      // Replace StripeAPI.createCharge with your Stripe API call using the library
      await StripeAPI.createCharge(/* charge data */);
      setLoading(false);
    } catch (error) {
      console.error('Error creating charge:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={sendTwilioNotification}>Send Twilio Message</button>
      <button onClick={initiateStripePayment}>Create Stripe Charge</button>

      {loading && (
        // Display the loading indicator while the API calls are in progress
        <div className="loading-indicator">
          {/* Replace with your chosen loading indicator (SVG, spinner, etc.) */}
          Loading...
        </div>
      )}
    </div>
  );
};

export default Api;