import styles from "./InvoiceListItem.module.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import InvoiceState from "./InvoiceStatus";
import iconArrow from "../assets/icon-arrow-right.svg";
import useInvoicesContext from "../hooks/use-invoices-context";

function InvoiceListItem({ invoice }) {
  const { invoiceId, paymentDue, customerName, total, status, businessName } =
    invoice;

  function formatDate(paymentDue) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(paymentDue);
    return date.toLocaleDateString("en-CA", options);
  }

  // Create a number/currency formatter.
  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  });

  const { userType } = useInvoicesContext();

  const derivedName = userType === "customer" ? businessName : customerName; //derived state

  const derivedStatus =
    userType === "customer" && status === "pending" ? "unpaid" : status;

  const derivedTotal = formatter.format(Number(total) / 100);

  return (
    <li>
      <Link to={`/invoices/${invoiceId}`} className={styles.card}>
        <div>
          <span className={styles.invoiceTag}>#</span>
          <span className="strong">{invoiceId}</span>
        </div>
        <div>Due {formatDate(paymentDue)}</div>
        <div>{derivedName}</div>
        <div className="strong">{derivedTotal}</div>
        <InvoiceState status={derivedStatus} />
        <img src={iconArrow} alt="icon arrow right" />
      </Link>
    </li>
  );
}

InvoiceListItem.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default InvoiceListItem;
