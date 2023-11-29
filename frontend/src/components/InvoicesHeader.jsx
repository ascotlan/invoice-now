import styles from "./InvoicesHeader.module.css";
import Button from "./Button";
import Dropdown from "./Dropdown";
import useInvoicesContext from "../hooks/use-invoices-context";
import { ACTION } from "../helpers/form-constants";

function InvoicesHeader() {
  const {
    filteredInvoices,
    filter,
    handleFilter,
    options,
    setIsModalOpen,
    setSingleInvoice,
    dispatch,
  } = useInvoicesContext();

  const onOpenModal = () => {
    // Clear the singleInvoice data
    setSingleInvoice(null);

    // Dispatch RESET_FORM action to reset the form state
    dispatch({ type: ACTION.RESET_FORM });

    // Open the modal
    setIsModalOpen(true);
  };

  const totalInvoices = filteredInvoices?.length;
  const message =
    filteredInvoices?.length > 0
      ? `There are ${totalInvoices} total invoices`
      : "No Invoices";

  return (
    <header className={styles.container}>
      <div>
        <p className="headingLarge">Invoices</p>
        <p>{message}</p>
      </div>
      <div className={styles.changeView}>
        <Dropdown
          value={filter}
          onChange={handleFilter}
          array={options}
          type="filter"
        />
        <Button variant="add" onClick={onOpenModal}>
          New Invoice
        </Button>
      </div>
    </header>
  );
}

export default InvoicesHeader;
