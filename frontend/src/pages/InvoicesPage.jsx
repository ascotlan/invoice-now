import InvoicesHeader from '../components/InvoicesHeader';
import Sidebar from '../components/Sidebar';
import { Outlet } from "react-router-dom";

function InvoicesPage() {
  return (
    <section className="container">
      <Sidebar/>
      <InvoicesHeader/>
      <Outlet/>
    </section>
  );
}

export default InvoicesPage;
