import styles from "./Button.module.css";
import PropTypes from "prop-types";

function Button({type="button", icon, children, onClick, variant, disabled=false}) {
  return (
    <button type={type} onClick={onClick} className={`${styles.btn} ${styles[variant]}`} disabled={disabled}>
      {children}
      {icon}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.object,
  type:PropTypes.string
};

export default Button;
