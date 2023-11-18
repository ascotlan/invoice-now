import styles from "./InvoicesHeader.module.css";
import Button from "./Button";

function InvoicesHeader() {
  const totalInvoices = 3; //Get invoices state using useContext
  const message =
    totalInvoices > 0
      ? `There are ${totalInvoices} total invoices`
      : "No Invoices";

  return (
    <header className={styles.container}>
      <div>
        <p className="headingLarge">Invoices</p>
        <p>{message}</p>
      </div>
      <div className={styles.changeView}>
        <select>
          <option value="">Filter by status</option>
        </select>

        <Button />
      </div>
    </header>
  );
}

export default InvoicesHeader;
