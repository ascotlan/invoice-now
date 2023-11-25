import styles from "./InvoiceListItem.module.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import InvoiceState from "./InvoiceStatus";
import iconArrow from "../assets/icon-arrow-right.svg";
import useInvoicesContext from "../hooks/use-invoices-context";
import {formatCurrency, formatDate, derivedStatus} from '../helpers/format-data';

function InvoiceListItem({ invoice }) {
  const { invoiceNumber, paymentDue, customerName, total, status, businessName } =
    invoice;

  const { userType } = useInvoicesContext();

  const derivedName = userType === "customer" ? businessName : customerName; //derived state

  const derivedTotal = formatCurrency.format(Number(total) / 100);

  return (
    <li>
      <Link to={`/invoices/${invoiceNumber}`} className={styles.card}>
        <div>
          <span className="invoice-tag">#</span>
          <span className="strong">{invoiceNumber}</span>
        </div>
        <div>Due {formatDate(paymentDue)}</div>
        <div>{derivedName}</div>
        <div className="strong">{derivedTotal}</div>
        <InvoiceState status={derivedStatus(userType, status)} />
        <img src={iconArrow} alt="icon arrow right" />
      </Link>
    </li>
  );
}

InvoiceListItem.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default InvoiceListItem;
