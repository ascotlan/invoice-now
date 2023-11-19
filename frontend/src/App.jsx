import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoicesProvider } from "./context/invoices";
import LandingPage from "./pages/LandingPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import InvoiceList from "./components/InvoiceList";

function App() {
  return (
    <BrowserRouter>
      <InvoicesProvider>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="invoices" element={<InvoicesPage />}>
            <Route index element={<InvoiceList />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="invoices/:id" element={<InvoiceDetailsPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </InvoicesProvider>
    </BrowserRouter>
  );
}

export default App;
