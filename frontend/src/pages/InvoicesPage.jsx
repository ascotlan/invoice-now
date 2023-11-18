import styles from './InvoicesPage.module.css'
import { Outlet } from "react-router-dom";

function InvoicesPage() {
  return (
    <section className={styles.container}>
      <p className="headingLarge">Invoices</p>
      <Outlet/>
    </section>
  );
}

export default InvoicesPage;
