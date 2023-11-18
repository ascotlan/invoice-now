import styles from "./InvoiceStatus.module.css";
import PropTypes from "prop-types";
import BulletPoint from "./BulletPoint";

function InvoiceStatus({ status }) {
  
  function capitalizeFirstLetter(word) {
    return word.slice(0, 1).toUpperCase() + word.slice(1);
  }

  const styling =
    status === "paid"
      ? styles.paid
      : status === "pending" || status === "unpaid"
      ? styles.pending
      : styles.draft;

  const fill =
  status === "paid"
  ? "#1f805f"
  : status === "pending" || status === "unpaid"
  ? "#995600"
  : "#373b53";

  return (
    <div className={styling}>
      <BulletPoint fill={fill}/>
      <span>{capitalizeFirstLetter(status)}</span>
    </div>
  );
}

InvoiceStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

export default InvoiceStatus;
