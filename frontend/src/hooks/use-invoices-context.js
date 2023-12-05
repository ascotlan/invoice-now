import { useContext } from "react";
import { InvoicesContext } from "../context/invoices";

function useInvoicesContext() {
  return useContext(InvoicesContext);
}

export default useInvoicesContext;
