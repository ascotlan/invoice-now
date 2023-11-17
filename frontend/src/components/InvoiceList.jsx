import PropTypes from "prop-types";
import Empty from "./Empty";
import InvoiceListItem from "./InvoiceListItem";

function InvoiceList({ isLoading, invoices }) {
  const renderedInvoices = invoices.map((invoice) => (
    <InvoiceListItem key={invoice.invoiceId} invoice={invoice} />
  ));

  return (
    <ul>{isLoading || invoices.length === 0 ? <Empty /> : renderedInvoices}</ul>
  );
}

InvoiceList.propTypes = {
  invoices: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default InvoiceList;
