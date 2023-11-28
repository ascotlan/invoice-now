import InvoicesHeader from "../components/InvoicesHeader";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import useInvoicesContext from "../hooks/use-invoices-context";
import InvoiceForm from "../components/InvoiceForm";
import { useEffect } from "react";

function InvoicesPage() {
  const { isModalOpen, setIsModalOpen } = useInvoicesContext();
  const toggleModal = () => setIsModalOpen((current) => !current);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isModalOpen]);

  return (
    <section className="container">
      <Sidebar />
      <InvoicesHeader onOpenModal={toggleModal} />
      {isModalOpen && (
        <>
          <div className="backdrop"></div>
          <InvoiceForm />
        </>
      )}
      <Outlet />
    </section>
  );
}

export default InvoicesPage;
