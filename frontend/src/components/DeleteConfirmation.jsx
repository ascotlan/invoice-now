import useInvoicesContext from "../hooks/use-invoices-context";
import styles from "./DeleteConfirmation.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function DeleteConfirmation() {
  const { toggleDeleteSuccessModalOpen } = useInvoicesContext();
  const navigate = useNavigate();

  const handleDeleteConfirmation = () => {
    toggleDeleteSuccessModalOpen();
    navigate("/invoices");
  }

  return (
    <aside className={styles.deleteConfirmationModalBackdrop}>
      <div className={styles.deleteConfirmationModal}>
        <p className={styles.message}>Invoice successfully deleted.</p>
        <Button variant="close" onClick={handleDeleteConfirmation}>Close</Button>
      </div>
    </aside>
  );
}

export default DeleteConfirmation;
