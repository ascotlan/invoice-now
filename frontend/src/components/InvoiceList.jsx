import styles from "./InvoiceList.module.css";

import PropTypes from "prop-types";
import Empty from "./Empty";
import InvoiceListItem from "./InvoiceListItem";

function InvoiceList({ isLoading, invoices }) {
  // const userType = "customer"; // This comes from mock auth state...useContext
  const userType = "business"; // This comes from mock auth state...useContext

  const renderedInvoices = invoices.reduce((acc, invoice) => {
    if (
      userType === "business" ||
      (invoice.status !== "draft" && userType === "customer")
    ) {
      acc.push(<InvoiceListItem key={invoice.invoiceId} invoice={invoice} />);
    }
    return acc;
  }, []);

  return (
    <ul className={styles.container}>
      {isLoading || renderedInvoices.length === 0 ? (
        <Empty isLoading ={isLoading}/>
      ) : (
        renderedInvoices
      )}
    </ul>
  );
}

InvoiceList.propTypes = {
  invoices: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default InvoiceList;
