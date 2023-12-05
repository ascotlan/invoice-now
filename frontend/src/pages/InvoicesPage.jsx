import InvoicesHeader from "../components/InvoicesHeader";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import useInvoicesContext from "../hooks/use-invoices-context";
import InvoiceForm from "../components/InvoiceForm";
import { useEffect } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

function InvoicesPage() {
  const { isModalOpen, isNotifiedModalOpen, toggleNotificationModal, userType } = useInvoicesContext();

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
      {isModalOpen && userType === "business" && (
        <>
          <div className="backdrop"></div>
          <InvoiceForm />
        </>
      )}
      {isNotifiedModalOpen && (
        <ConfirmationModal
          message={`Notification sucessfully sent!`}
          onToggle={toggleNotificationModal}
        />
      )}
      <Outlet />
    </main>
  );
}

export default InvoicesPage;
