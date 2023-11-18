import styles from "./InvoiceListItem.module.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import InvoiceState from "./InvoiceStatus";
import iconArrow from "../assets/icon-arrow-right.svg"

function InvoiceListItem({ invoice }) {
  const { invoiceId, paymentDue, customerName, total, status, businessName} = invoice;

  function formatDate(paymentDue) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(paymentDue);
    return date.toLocaleDateString("en-CA", options);
  }

  // const userType = "customer" // This comes from mock auth state...useContext 
  const userType = "business" // This comes from mock auth state...useContext 

  const name = userType === "customer" ? businessName : customerName; //derived state
  const derivedStatus = userType === "customer" && status === "pending" ? "unpaid" : status

  return (
    <li >
      <Link to={`/invoices/${invoiceId}`} className={styles.card}>
        <div>
         <span className={styles.invoiceTag}>#</span><span className="strong">{invoiceId}</span>
        </div>
        <div>Due {formatDate(paymentDue)}</div>
        <div>{name}</div>
        <div className="strong">${(total / 100).toFixed(2)}</div>
        <InvoiceState status={derivedStatus} />
        <img src={iconArrow} alt="icon arrow right"/>
      </Link>
    </li>
  );
}

InvoiceListItem.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default InvoiceListItem;
