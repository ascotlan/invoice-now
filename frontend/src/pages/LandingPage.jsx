import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <>
      <h1>Landing Page</h1>
      <Link to="/invoices">to invoices</Link>
    </>
  );
}

export default LandingPage;
