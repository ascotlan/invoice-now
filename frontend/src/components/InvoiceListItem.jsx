import PropTypes from "prop-types"; 
import InvoiceState from "./InvoiceStatus";

function InvoiceListItem({invoice}) {
  const {invoiceId, paymentDue, customerName, total, status} = invoice;
  return (
    <li>
      <div>{invoiceId}</div>
      <div>{paymentDue}</div>
      <div>{customerName}</div>
      <div>${(total/100).toFixed(2)}</div>
      <InvoiceState status={status}/>
    </li>
  )
}

InvoiceListItem.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default InvoiceListItem
