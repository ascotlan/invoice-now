import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import useFilter from "../hooks/use-filter";
import useInvoiceForm from "../hooks/use-invoice-form";

const InvoicesContext = createContext();

const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [singleInvoice, setSingleInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state
  const userType = "business"; //temporary, a api call is required to auth and receive the user type

  // const userType = "customer"  //temporary, a api call is required to auth and receive the user type

  useEffect(() => {
    const getAllInvoices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/invoices");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        setIsError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAllInvoices();
  }, []);

  // createInvoice function
  const createInvoice = useCallback(async (invoiceData) => {
    try {
      const response = await fetch("/api/invoices", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          userId: 1 // get this after auth *****************
        },
        method: "POST",
        body: JSON.stringify(invoiceData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const newInvoice = await response.json();
      setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
    } catch (err) {
      setIsError(err.message);
      console.log(err.message);
    }
  }, []);

  const { filter, handleFilter, filteredInvoices, options } = useFilter(
    userType,
    invoices
  );

  // updateInvoice function
  const updateInvoice = useCallback(async (invoiceData) => {
    console.log(invoiceData)
  }, [])

  const getInvoice = useCallback(async (id) => {
    const getInvoice = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/invoices/${id}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            userId: 1 // get this after auth *****************
          },
          method: "GET"
        })
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSingleInvoice(data);
      } catch (err) {
        setIsError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getInvoice();
  }, [])

  const {
    formState,
    arrayOfOptions,
    updateField,
    handleSelection,
    addItem,
    updateItem,
    removeItem,
    handleSaveChanges,
    handleDiscardChanges,
    handleSaveAsDraft,
    handleSaveAndSend,
    selectedPaymentTermOption,
  } = useInvoiceForm(createInvoice, updateInvoice, setIsModalOpen);

  const valueToShare = {
    filteredInvoices,
    isLoading,
    isError,
    options: options,
    filter,
    handleFilter,
    userType,
    isModalOpen,
    setIsModalOpen,
    formState,
    arrayOfOptions,
    updateField,
    handleSelection,
    addItem,
    updateItem,
    removeItem,
    handleSaveChanges,
    handleDiscardChanges,
    handleSaveAsDraft,
    handleSaveAndSend,
    selectedPaymentTermOption,
    singleInvoice,
    getInvoice
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
