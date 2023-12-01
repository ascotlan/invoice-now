import PropTypes from "prop-types";
import styles from "./Empty.module.css";
import placeholder from "../assets/illustration-empty.svg";
import useInvoicesContext from "../hooks/use-invoices-context";

function Empty({ isLoading, isError }) {
  const { userType } = useInvoicesContext();

  const title = isLoading ? "Loading..." : "There is nothing here";
  const message = userType === "business" && !isLoading
    ? "Create an invoice by clicking the New Invoice button and get started"
    : "";

  return (
    <div className={`${styles.container}`}>
      <img
        className={styles.imgSize}
        src={placeholder}
        alt="No content available"
      />
      <h1 className="strong">{title}</h1>
      {!isError && <p>{message}</p>}
      {isError && <p className={styles.error}>{isError}</p>}
    </div>
  );
}

Empty.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.string
};

export default Empty;
