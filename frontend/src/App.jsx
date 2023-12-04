import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoicesProvider } from "./context/invoices";
import { UserProvider } from "./context/user";
import LandingPage from "./pages/LandingPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import PageNotFound from "./pages/PageNotFound";
import InvoiceList from "./components/InvoiceList";
import InvoiceDetails from "./components/InvoiceDetails";
import AuthenticatedRoutes from "./components/AuthenticatedRoutes";
import { StripeProvider } from "./context/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { REACT_APP_STRIPE_PUBLIC_KEY } from "./config/config";


const stripePromise = loadStripe(REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <InvoicesProvider>
          <StripeProvider>
            <Elements stripe={stripePromise}>
              <Routes>
                <Route index element={<LandingPage />} />
                <Route path="*" element={<PageNotFound />} />
                <Route element={<AuthenticatedRoutes />}>
                  <Route path="invoices" element={<InvoicesPage />}>
                    <Route index element={<InvoiceList />} />
                  </Route>
                  <Route path="invoices/:id" element={<InvoiceDetailsPage />}>
                    <Route index element={<InvoiceDetails />} />
                  </Route>
                </Route>
              </Routes>
            </Elements>
          </StripeProvider>
        </InvoicesProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
