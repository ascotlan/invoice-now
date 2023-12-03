import { useNavigate } from "react-router-dom";
import styles from "./ConfirmationModal.module.css";
import PropTypes from "prop-types";
import Button from "./Button";

function ConfirmationModal({ onToggle, message}) {
  const navigate = useNavigate();
  const handleNotifyConfirmation = () => {
    onToggle();
    navigate("/invoices");
  };

  return (
    <aside className={styles.notifyConfirmationModalBackdrop}>
      <div className={styles.notifyConfirmationModal}>
        <p className={styles.message}>{message}</p>
        <Button variant="close" onClick={handleNotifyConfirmation}>
          Close
        </Button>
      </div>
    </aside>
  );
}

ConfirmationModal.propTypes = {
  message: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ConfirmationModal;
