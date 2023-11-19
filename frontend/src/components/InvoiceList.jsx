import styles from "./InvoiceList.module.css";
import useInvoicesContext from "../hooks/use-invoices-context";
import Empty from "./Empty";
import InvoiceListItem from "./InvoiceListItem";

function InvoiceList() {
  const { isLoading, filteredInvoices, userType } = useInvoicesContext();

  const renderedInvoices = filteredInvoices.reduce((acc, invoice) => {
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
        <Empty isLoading={isLoading} />
      ) : (
        renderedInvoices
      )}
    </ul>
  );
}

export default InvoiceList;
