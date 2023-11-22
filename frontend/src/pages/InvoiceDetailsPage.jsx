import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function InvoiceDetailsPage() {
  return (
    <section className="container">
      <Sidebar />
      <Outlet/>
    </section>
  );
}

export default InvoiceDetailsPage;
