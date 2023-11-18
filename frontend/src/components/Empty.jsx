import PropTypes from "prop-types";
import styles from "./Empty.module.css";
import placeholder from "../assets/illustration-empty.svg";

function Empty({ isLoading }) {
  // const userType = "customer"; // This comes from mock auth state...useContext
  const userType = "business"; // This comes from mock auth state...useContext

  const title = isLoading ? "...Loading" : "There is nothing here";
  const message = userType === "business" && !isLoading
    ? "Create an invoice by clicking the New Invoice button and get started"
    : "No invoices created for you yet";

  return (
    <div className={`${styles.container}`}>
      <img
        className={styles.imgSize}
        src={placeholder}
        alt="No content available"
      />
      <h1 className="strong">{title}</h1>
      <p>{message}</p>
    </div>
  );
}

Empty.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Empty;
