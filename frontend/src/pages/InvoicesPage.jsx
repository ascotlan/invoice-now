import InvoicesHeader from "../components/InvoicesHeader";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import useInvoicesContext from "../hooks/use-invoices-context";
import InvoiceForm from "../components/InvoiceForm";
import { useEffect } from "react";

function InvoicesPage() {
  const { isModalOpen } = useInvoicesContext();

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('no-scroll');
    } 
    
    // clean up
    return () => document.body.classList.remove('no-scroll');
    
  }, [isModalOpen]);

  return (
    <main className="container">
      <Sidebar />
      <InvoicesHeader/>
      {isModalOpen && (
        <>
          <div className="backdrop"></div>
          <InvoiceForm />
        </>
      )}
      <Outlet />
    </main>
  );
}

export default InvoicesPage;
