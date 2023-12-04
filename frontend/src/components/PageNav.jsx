import styles from "./PageNav.module.css";
import Logo from "../assets/logo-blue.svg";
import Button from "../components/Button";
import useUserContext from "../hooks/use-user-context";

function PageNav() {
  const { login } = useUserContext();
  return (
    <nav className={styles.nav}>
    <span><img src={Logo} alt="Logo"/> InvoiceNow</span>
      <ul>
        <li>
          <Button variant="transact" onClick={() => login("11")}>Visit Customer Portal</Button>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
