import InvoicesHeader from '../components/InvoicesHeader';
import styles from './InvoicesPage.module.css'
import { Outlet } from "react-router-dom";

function InvoicesPage() {
  return (
    <section className={styles.container}>
      <InvoicesHeader/>
      <Outlet/>
    </section>
  );
}

export default InvoicesPage;
