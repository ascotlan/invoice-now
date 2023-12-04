import useUserContext from "../hooks/use-user-context";
import styles from "./LandingPage.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";

function LandingPage() {
  const { login } = useUserContext();
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          <span className={styles.punchline}>You&apos;re a small business owner.</span>
          <br/>
          InvoiceNow streamlines your invoicing process.
        </h1>
        <br />
        <h2>
          InvoiceNow is revolutionizing the way small businesses and freelancers
          manage their invoicing. It&apos;s an all-in-one invoicing solution
          that makes creating, sending, and tracking invoices effortless.
          Welcome to stress-free invoicing, welcome to InvoiceNow!
        </h2>
        <Button variant="cta" onClick={() => login("9")}>
          Connect with customers
        </Button>
      </section>
    </main>
  );
}

export default LandingPage;

