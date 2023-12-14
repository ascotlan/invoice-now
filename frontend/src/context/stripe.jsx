import { createContext, useState } from "react";
import PropTypes from "prop-types";

const StripeContext = createContext();

// Accessing the API URL from environment variables
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

function StripeProvider({ children }) {
  const [paymentError, setPaymentError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStripeModalOpen, setIsStripeModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  //toggle modal
  const toggleStripeModal = () => setIsStripeModal((current) => !current);
  const toggleSuccessModal = () => setIsSuccessModalOpen((current) => !current);

  const createPaymentIntent = async (paymentDetails, userId) => {
    try {
      const response = await fetch(`${apiUrl}/api/stripe/create-payment-intent`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          userId,
        },
        method: "POST",
        credentials: "include", // This is important for cookies
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSuccessMessage(data.message);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const valuesToShare = {
    createPaymentIntent,
    paymentError,
    setPaymentError,
    isLoading,
    setIsLoading,
    isStripeModalOpen,
    toggleStripeModal,
    successMessage,
    isSuccessModalOpen,
    toggleSuccessModal
  };

  return (
    <StripeContext.Provider value={valuesToShare}>
      {children}
    </StripeContext.Provider>
  );
}

StripeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { StripeProvider };
export default StripeContext;
