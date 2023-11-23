import React, { useState } from 'react';
import axios from 'axios';

const SendMessage = () => {
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:9000/send-message', {
        to: phoneNumber,
        messageBody: message
      });

      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message!');
    }
  };

  return (
    <div>
      {/* Input fields for phone number and message */}
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default SendMessage;