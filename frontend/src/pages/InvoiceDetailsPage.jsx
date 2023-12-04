import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import useStripeContext from "../hooks/use-stripe-context";
import useInvoicesContext from "../hooks/use-invoices-context";
import { useEffect } from "react";
import InvoiceForm from "../components/InvoiceForm";
import Delete from "../components/Delete";
import ConfirmationModal from "../components/ConfirmationModal";
import StripePayment from "../components/StripePayment";

function InvoiceDetailsPage() {
  const {
    isModalOpen,
    isDeleteModalOpen,
    isDeleteSuccessModalOpen,
    toggleDeleteSuccessModalOpen,
    isNotifiedModalOpen,
    toggleNotificationModal,
    smsSuccessMessage
  } = useInvoicesContext();

  const {
    isStripeModalOpen,
    successMessage,
    isSuccessModalOpen,
    toggleSuccessModal
  } = useStripeContext();

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
      {isStripeModalOpen && <StripePayment />}
      {isDeleteModalOpen && <Delete />}
      {isDeleteSuccessModalOpen && (
        <ConfirmationModal
          message={"Invoice successfully deleted."}
          onToggle={toggleDeleteSuccessModalOpen}
        />
      )}
      {isNotifiedModalOpen && (
        <ConfirmationModal
          message={ smsSuccessMessage}
          onToggle={toggleNotificationModal}
        />
      )}

      {isSuccessModalOpen && (
        <ConfirmationModal
          message={successMessage}
          onToggle={toggleSuccessModal}
        />
      )}
    </main>
  );
}

export default InvoiceDetailsPage;
