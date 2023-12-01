import Button from "../components/Button";
import useUserContext from "../hooks/use-user-context";

function LandingPage() {
  const { login } = useUserContext();
  return (
    <>
      <h1>Landing Page</h1>
      <Button variant="businessLogin" onClick={() => login("9")}>
        Connect with customers
      </Button>
      <Button variant="customerLogin" onClick={() => login("11")}>Transact with ease</Button>
    </>
  );
}

export default LandingPage;
