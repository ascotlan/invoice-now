import { useContext } from "react";
import StripeContext from "../context/stripe";

function useStripeContext() {
  return useContext(StripeContext);
}

export default useStripeContext;