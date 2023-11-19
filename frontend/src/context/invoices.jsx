import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import useFilter from "../hooks/use-filter";

const InvoicesContext = createContext();

const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userType = "business"; //temporary, a api call is required to auth and receive the user type

  // const userType = "customer"  //temporary, a api call is required to auth and receive the user type

  useEffect(() => {
    const getInvoices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/invoices");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getInvoices();
  }, []);

  const { filter, handleFilter, filteredInvoices, options } = useFilter(
    userType,
    invoices
  );

  const valueToShare = {
    filteredInvoices,
    isLoading,
    options: options,
    filter,
    handleFilter,
    userType,
  };

  return (
    <InvoicesContext.Provider value={valueToShare}>
      {children}
    </InvoicesContext.Provider>
  );
};

InvoicesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { InvoicesProvider };
export default InvoicesContext;
