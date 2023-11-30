import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import useFilter from "../hooks/use-filter";
import useInvoiceForm from "../hooks/use-invoice-form";
import { useNavigate } from "react-router-dom";

const InvoicesContext = createContext();

const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [singleInvoice, setSingleInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // modal state
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(Date.now());
  const navigate = useNavigate();
  const userType = "business"; //temporary, a api call is required to auth and receive the user type

  // const userType = "customer"  //temporary, a api call is required to auth and receive the user type
  const userId = 1; //temporary, a api call is required to auth and receive the user type

  const { filter, handleFilter, filteredInvoices, options } = useFilter(
    userType,
    invoices
  );

  const toggleModal = () => setIsModalOpen((current) => !current);
  const toggleDeleteModal = () => setIsDeleteModalOpen((current) => !current);
  const toggleDeleteSuccessModalOpen = () =>
    setIsDeleteSuccessModalOpen((curr) => !curr);

  useEffect(() => {
    const getAllInvoices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/invoices", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            userId, // get this after auth *****************
          },
          method: "GET",
        });

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
          userId, // get this after auth *****************
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

  // updateInvoice function
  const updateInvoice = useCallback(async (invoiceData) => {
    console.log(invoiceData);
  }, []);

  //updateInvoiceStatus
  const updateInvoiceStatus = useCallback(
    async (invoiceData) => {
      try {
        const response = await fetch(
          `/api/invoices/${invoiceData.invoiceNumber}/status`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              userId, // get this after auth *****************
            },
            method: "POST",
            body: JSON.stringify({
              invoiceNumber: invoiceData.invoiceNumber,
              status: invoiceData.status,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedInvoice = await response.json();

        // Update the invoices state to reflect the change
        setInvoices((current) =>
          current.map((invoice) =>
            invoice.invoiceNumber === updatedInvoice.invoiceNumber
              ? { ...invoice, status: updatedInvoice.status }
              : invoice
          )
        );

        // Update the singleInvoice state if it's the same invoice
        if (
          singleInvoice &&
          singleInvoice.invoiceNumber === updatedInvoice.invoiceNumber
        ) {
          setSingleInvoice(updatedInvoice);
        }

        setLastUpdateTimestamp(Date.now()); // Update the timestamp
      } catch (err) {
        setIsError(err.message);
        console.log(err.message);
      }
    },
    [singleInvoice]
  );

  //Read an invoice
  const getInvoice = useCallback(async (id) => {
    const getInvoice = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/invoices/${id}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            userId, // get this after auth *****************
          },
          method: "GET",
        });
        if (!response.ok) {
          // If the invoice is not found (e.g., 404 status), redirect the user
          if (response.status === 404) {
            navigate("/invoices");
            return;
          }
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
  }, []);

  // deleteInvoice function
  const deleteInvoice = useCallback(async (invoiceNumber) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceNumber}/delete`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          userId,
        },
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setInvoices((current) =>
        current.filter((invoice) => invoice.invoiceNumber !== invoiceNumber)
      );
      setIsDeleteSuccessModalOpen(true);
    } catch (err) {
      setIsError(err.message);
      console.log(err.message);
    }
  }, []);

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
    handleChangeInvoiceStatus,
    dispatch,
  } = useInvoiceForm(
    createInvoice,
    updateInvoice,
    setIsModalOpen,
    updateInvoiceStatus,
    singleInvoice
  );

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
    setSingleInvoice,
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
    getInvoice,
    toggleModal,
    dispatch,
    toggleDeleteModal,
    toggleDeleteSuccessModalOpen,
    isDeleteSuccessModalOpen,
    isDeleteModalOpen,
    deleteInvoice,
    handleChangeInvoiceStatus,
    lastUpdateTimestamp,
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
