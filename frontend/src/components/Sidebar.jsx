import Logo from "../assets/logo.svg";
import LogoutIcon from "./LogoutIcon";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const picture_url = "https://i.pravatar.cc/60"; //comes from state
  const name = "Antonio Scotland"; //comes from state
  const id = 195; //comes from state
  const onLogoff = () => null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={Logo} alt="InvoiceNow Logo" />
      </div>
      <div className= {styles.sidebarItems}>
        <LogoutIcon fill={"#ec5757"} onClick={onLogoff} />
        <div className={styles.avatarContainer}>
          <img
            className={styles.avatar}
            src={`${picture_url}?u=${id}`}
            alt={name}
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
