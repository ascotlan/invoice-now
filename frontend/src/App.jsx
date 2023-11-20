import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { REACT_APP_STRIPE_PUBLIC_KEY, } from "./config/config.jsx";
const stripePromise = loadStripe(REACT_APP_STRIPE_PUBLIC_KEY);


import LandingPage from "./pages/LandingPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import InvoiceList from "./components/InvoiceList";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from './components/StripePayment';



const stripePublicKey = REACT_APP_STRIPE_PUBLIC_KEY;

console.log(stripePublicKey);
function App() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getInvoices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/invoices");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getInvoices();
  }, []);

  console.log(isLoading);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="invoices" element={<InvoicesPage />}>
          <Route index element={<InvoiceList invoices={invoices} isLoading={isLoading}/>} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="invoices/:id" element={<InvoiceDetailsPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Elements stripe={stripePromise}>
        <StripePayment />
      </Elements>
    </BrowserRouter>
    
  );
}

export default App;
