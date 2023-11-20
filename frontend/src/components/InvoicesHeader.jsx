import styles from "./InvoicesHeader.module.css";
import Button from "./Button";
import Dropdown from "./Dropdown";
import useInvoicesContext from "../hooks/use-invoices-context";

function InvoicesHeader() {
  const { filteredInvoices, filter, handleFilter, options } =
    useInvoicesContext();

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
        <Dropdown value={filter} onChange={handleFilter} array={options} />
        <Button type="add" onClick={() => null}>New Invoice</Button>
      </div>
    </header>
  );
}

export default InvoicesHeader;
