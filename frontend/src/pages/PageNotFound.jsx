import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import styles from "./PageNotFound.module.css";

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Sidebar />
      <div className={`container ${styles.flex}`}>
      <Button variant="back" onClick={() => navigate(-1)}>Go Back</Button>
      <p className={styles.message}>404 Page Not Found :(</p>
      </div>
    </>
  );
}

export default PageNotFound;
