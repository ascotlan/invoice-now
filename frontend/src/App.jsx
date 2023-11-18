import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import InvoiceList from "./components/InvoiceList";

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
    </BrowserRouter>
  );
}

export default App;
