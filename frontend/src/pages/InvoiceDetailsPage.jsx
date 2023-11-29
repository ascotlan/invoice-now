import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import useInvoicesContext from "../hooks/use-invoices-context";
import { useEffect } from "react";
import InvoiceForm from "../components/InvoiceForm";
import Delete from "../components/Delete";
import DeleteConfirmation from "../components/DeleteConfirmation";

function InvoiceDetailsPage() {
  const { isModalOpen, isDeleteModalOpen, isDeleteSuccessModalOpen } = useInvoicesContext();

  useEffect(() => {
    if (isModalOpen || isDeleteModalOpen) {
      document.body.classList.add("no-scroll");
    }

    // clean up
    return () => document.body.classList.remove("no-scroll");
  }, [isModalOpen, isDeleteModalOpen]);

  return (
    <main className="container">
      <Sidebar />
      <Outlet />
      {isModalOpen && (
        <>
          <div className="backdrop"></div>
          <InvoiceForm isEditMode={isModalOpen} />
        </>
      )}
      {isDeleteModalOpen && <Delete />}
      {isDeleteSuccessModalOpen && <DeleteConfirmation/>}
    </main>
  );
}

export default InvoiceDetailsPage;
