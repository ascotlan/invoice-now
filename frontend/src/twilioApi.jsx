import React from 'react';
import { sendSMS } from './twilioApi'; // Import the Twilio service function

const TwilioIntegration = () => {
  const sendTwilioNotification = async () => {
    try {
      await sendSMS('+15203998681', 'Hello from Twilio!'); // Replace with your phone number and message
      // Handle success or display a success message
    } catch (error) {
      // Handle error or display an error message
    }
  };

  return (
    <div>
      <button onClick={sendTwilioNotification}>Send SMS</button>
      {/* Add UI elements or feedback for the Twilio integration */}
    </div>
  );
};

export default twilioApi;