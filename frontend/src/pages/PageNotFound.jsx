import styles from "./PageNotFound.module.css";

function PageNotFound() {
  return (
    <div className={`container ${styles.flex}`}>
      <p className={styles.message}>404 Page Not Found :(</p>
    </div>
  );
}

export default PageNotFound;
