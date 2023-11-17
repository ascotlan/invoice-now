import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="invoices/:id" element={<InvoiceDetailsPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
