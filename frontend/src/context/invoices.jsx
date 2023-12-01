import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import useFilter from "../hooks/use-filter";
import useInvoiceForm from "../hooks/use-invoice-form";
import { useNavigate } from "react-router-dom";
import useUserContext from "../hooks/use-user-context";

const InvoicesContext = createContext();

const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [singleInvoice, setSingleInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // modal state
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false); // modal state
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(Date.now());
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserContext();

   // Check if user is not null before destructuring
  const userId = user ? user.userId : null;
  const userType = user ? user.userType : null;

  const { filter, handleFilter, filteredInvoices, options } = useFilter(
    userType,
    invoices
  );

  const toggleModal = () => setIsModalOpen((current) => !current);
  const toggleDeleteModal = () => setIsDeleteModalOpen((current) => !current);
  const toggleDeleteSuccessModalOpen = () =>
    setIsDeleteSuccessModalOpen((curr) => !curr);

  useEffect(() => {
    if (isAuthenticated) {
      const getAllInvoices = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/invoices", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              userId,
            },
            method: "GET",
            credentials: "include", // This is important for cookies
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
    }
  }, [userId, isAuthenticated]);

  // createInvoice function
  const createInvoice = useCallback(
    async (invoiceData) => {
      if (isAuthenticated) {
        try {
          const response = await fetch("/api/invoices", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              userId,
            },
            method: "POST",
            body: JSON.stringify(invoiceData),
            credentials: "include", // This is important for cookies
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
      }
    },
    [userId, isAuthenticated]
  );

  // updateInvoice function
  const updateInvoice = useCallback(async (invoiceData) => {
    console.log(invoiceData);
  }, []);

  //updateInvoiceStatus
  const updateInvoiceStatus = useCallback(
    async (invoiceData) => {
      if (isAuthenticated) {
        try {
          const response = await fetch(
            `/api/invoices/${invoiceData.invoiceNumber}/status`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                userId,
              },
              credentials: "include", // This is important for cookies
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
      }
    },
    [singleInvoice, userId, isAuthenticated]
  );

  //Read an invoice
  const getInvoice = useCallback(
    async (id) => {
      if (isAuthenticated) {
        const getInvoice = async () => {
          setIsLoading(true);
          try {
            const response = await fetch(`/api/invoices/${id}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                userId, // get this after auth *****************
              },
              credentials: "include", // This is important for cookies
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
      }
    },
    [navigate, userId, isAuthenticated]
  );

  // deleteInvoice function
  const deleteInvoice = useCallback(
    async (invoiceNumber) => {
      if (isAuthenticated) {
        try {
          const response = await fetch(
            `/api/invoices/${invoiceNumber}/delete`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                userId,
              },
              credentials: "include", // This is important for cookies
              method: "POST",
            }
          );
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
      }
    },
    [userId, isAuthenticated]
  );

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
