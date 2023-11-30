import Logo from "../assets/logo.svg";
import useUserContext from "../hooks/use-user-context";
import LogoutIcon from "./LogoutIcon";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const {user, logout} = useUserContext();
  const {userId, name, picture_url} = user;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={Logo} alt="InvoiceNow Logo" />
      </div>
      <div className= {styles.sidebarItems}>
        <LogoutIcon fill={"#ec5757"} onLogout={logout} />
        <div className={styles.avatarContainer}>
          <img
            className={styles.avatar}
            src={`${picture_url}?u=15${userId}`}
            alt={name}
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
