import styles from "./InvoiceDetailsHeader.module.css";
import PropTypes from "prop-types";
import Button from "./Button";
import useInvoicesContext from "../hooks/use-invoices-context";
import useStripeContext from "../hooks/use-stripe-context";

function InvoiceDetailsHeader({ children }) {
  const {
    userType,
    toggleModal,
    toggleDeleteModal,
    handleChangeInvoiceStatus,
  } = useInvoicesContext();

  const {toggleStripeModal} = useStripeContext();

  const isPaid = children.props.status === "paid";
  const isDraft = children.props.status === "draft";

  return (
    <header className={styles.header}>
      <div className={styles.spacing}>
        <p>Status</p>
        {children}
      </div>
      <div className={styles.spacing}>
        {userType === "business" && (
          <Button onClick={toggleModal} variant="edit" disabled={isPaid}>
            Edit
          </Button>
        )}
        {userType === "business" && (
          <Button onClick={toggleDeleteModal} variant="delete">
            Delete
          </Button>
        )}
        {userType === "business" && (
          <Button
            onClick={handleChangeInvoiceStatus}
            variant="state"
            disabled={isPaid || isDraft}
          >
            Mark as Paid
          </Button>
        )}
        {userType === "customer" && (
          <Button onClick={toggleStripeModal} variant="pay" disabled={isPaid}>
            Pay Invoice
          </Button>
        )}
      </div>
    </header>
  );
}

InvoiceDetailsHeader.propTypes = {
  children: PropTypes.node,
};

export default InvoiceDetailsHeader;
