import useInvoicesContext from "../hooks/use-invoices-context";
import styles from "./Delete.module.css";
import Button from "./Button";

function Delete() {
  const {
    formState,
    toggleDeleteModal,
    deleteInvoice,
  } = useInvoicesContext();

  const handleDelete = async (isDelete) => {
    if (isDelete) {
      await deleteInvoice(formState.invoiceNumber);
      toggleDeleteModal();
    } else {
      toggleDeleteModal();
    }
  };

  return (
    <aside className={styles.deleteModalBackdrop}>
      <div className={styles.deleteModal}>
        <h1 className="strong">Confirm Deletion</h1>
        <p>
          Are you sure you want to delete invoice #{formState.invoiceNumber}?
          This action cannot be undone.
        </p>
        <div className={styles.modalBtns}>
          <Button variant="cancel" onClick={() => handleDelete(false)}>
            Cancel
          </Button>
          <Button variant="delete" onClick={() => handleDelete(true)}>
            Delete
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default Delete;
