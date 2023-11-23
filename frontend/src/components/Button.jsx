import styles from "./Button.module.css";
import PropTypes from "prop-types";

function Button({ children, onClick, type, disabled}) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`} disabled={disabled}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool
};

export default Button;
