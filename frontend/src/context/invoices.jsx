import { createContext, useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import useFilter from "../hooks/use-filter";
import useInvoiceForm from "../hooks/use-invoice-form";
import { useNavigate } from "react-router-dom";
import useUserContext from "../hooks/use-user-context";

const InvoicesContext = createContext();

// Accessing the API URL from environment variables
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [singleInvoice, setSingleInvoice] = useState(null);
  const [deletedItems, setDeletedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // modal state
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false); // modal state
  const [isNotifiedModalOpen, setIsNotifiedModalOpen] = useState(false); // modal state
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(Date.now());
  const [smsSuccessMessage, setSmsSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserContext();

  // Check if user is not null before destructuring
  const userId = user ? user.userId : null;
  const userType = user ? user.userType : null;

  const { filter, handleFilter, filteredInvoices, options } = useFilter(
    userType,
    invoices,
    isAuthenticated
  );

  const toggleModal = () => setIsModalOpen((current) => !current);
  const toggleDeleteModal = () => setIsDeleteModalOpen((current) => !current);
  const toggleDeleteSuccessModalOpen = () =>
    setIsDeleteSuccessModalOpen((curr) => !curr);
  const toggleNotificationModal = () =>
    setIsNotifiedModalOpen((current) => !current);

  //store reference to invoices for use in getInvoiceById to prevent infinite loop
  const invoicesRef = useRef(invoices);
  useEffect(() => {
    invoicesRef.current = invoices;
  }, [invoices]);

  useEffect(() => {
    if (isAuthenticated) {
      const getAllInvoices = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${apiUrl}/api/invoices`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              userId,
            },
            credentials: "include", // This is important for cookies
            mode: "cors",
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
    }
  }, [userId, isAuthenticated]);

  //notification api post
  const sendMessage = useCallback(
    async (invoice, callback) => {
      try {
        // Make a POST request to your backend route that sends the SMS
        const response = await fetch(`${apiUrl}/api/notifications`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            userId,
          },
          credentials: "include", // This is important for cookies
          mode: "cors",
          method: "POST",
          body: JSON.stringify({
            phoneNumber: invoice.customerAddress.phoneNumber,
            message: callback(invoice),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSmsSuccessMessage(data.message);
      } catch (error) {
        console.error("Error sending message:", error);
        console.log("Failed to send message!");
      }
    },
    [userId]
  );

  // createInvoice function
  const createInvoice = useCallback(
    async (invoiceData) => {
      if (isAuthenticated) {
        try {
          const response = await fetch(`${apiUrl}/api/invoices`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              userId,
            },
            credentials: "include", // This is important for cookies
            mode: "cors",
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
      }
    },
    [userId, isAuthenticated]
  );

  // Create new items
  const createInvoiceItems = useCallback(
    async (invoiceNumber, items) => {
      if (isAuthenticated) {
        try {
          const response = await fetch(`${apiUrl}/api/invoices/${invoiceNumber}/items`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              userId,
            },
            credentials: "include", // This is important for cookies
            mode: "cors",
            method: "POST",
            body: JSON.stringify({ items }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const addedItems = await response.json();

          setInvoices((prevInvoices) =>
            prevInvoices.map((invoice) => {
              if (invoice.invoiceNumber === invoiceNumber) {
                // Combine old and new items
                const updatedItems = [...invoice.items, ...addedItems];

                // Calculate new total
                const newTotal = updatedItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                );

                // Check if the current singleInvoice is the one being updated
                if (
                  singleInvoice &&
                  singleInvoice.invoiceNumber === invoiceNumber
                ) {
                  setSingleInvoice({
                    ...invoice,
                    items: updatedItems,
                    total: newTotal,
                  });
                }

                return {
                  ...invoice,
                  items: updatedItems,
                  total: newTotal,
                };
              }
              return invoice;
            })
          );
        } catch (err) {
          setIsError(err.message);
          console.log(err.message);
        }
      }
    },
    [userId, isAuthenticated, singleInvoice]
  );

  // updateInvoice function
  const updateInvoice = useCallback(
    async (invoiceData) => {
      if (isAuthenticated) {
        try {
          const response = await fetch(
            `${apiUrl}/api/invoices/${invoiceData.invoiceNumber}`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                userId,
              },
              credentials: "include", // This is important for cookies
              mode: "cors",
              method: "POST",
              body: JSON.stringify(invoiceData),
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const updatedInvoice = await response.json();

          // Update the invoices to reflect the change
          setInvoices((current) =>
            current.map((invoice) =>
              invoice.invoiceNumber === updatedInvoice.invoiceNumber
                ? updatedInvoice
                : invoice
            )
          );

          // Update the singleInvoice if it's the same invoice
          if (
            singleInvoice &&
            singleInvoice.invoiceNumber === updatedInvoice.invoiceNumber
          ) {
            setSingleInvoice(updatedInvoice);
          }

          setLastUpdateTimestamp(Date.now()); // Update the timestamp
        } catch (error) {
          setIsError(error.message);
          console.log(error.message);
        }
      }
    },
    [singleInvoice, userId, isAuthenticated]
  );

  //updateInvoiceStatus
  const updateInvoiceStatus = useCallback(
    async (invoiceData) => {
      if (isAuthenticated) {
        try {
          const response = await fetch(
            `${apiUrl}/api/invoices/${invoiceData.invoiceNumber}/status`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                userId,
              },
              credentials: "include", // This is important for cookies
              mode: "cors",
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
            const response = await fetch(`${apiUrl}/api/invoices/${id}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                userId,
              },
              credentials: "include", // This is important for cookies
              mode: "cors",
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

            // Check if the fetched invoice matches any existing invoice
            const existingInvoiceIndex = invoicesRef.current.findIndex(
              (invoice) => invoice.invoiceNumber === data.invoiceNumber
            );

            if (existingInvoiceIndex !== -1) {
              // Update the specific invoice in the state
              setInvoices((currentInvoices) => {
                const updatedInvoices = [...currentInvoices];
                updatedInvoices[existingInvoiceIndex] = data;
                return updatedInvoices;
              });
            }

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
            `${apiUrl}/api/invoices/${invoiceNumber}/delete`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                userId,
              },
              credentials: "include", // This is important for cookies
              mode: "cors",
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

  // delete invoice item by id
  const deleteItemById = useCallback(
    async (invoiceNumber, itemId) => {
      if (isAuthenticated) {
        try {
          const response = await fetch(
            `${apiUrl}/api/invoices/${invoiceNumber}/items/${itemId}/delete`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                userId,
              },
              credentials: "include", // This is important for cookies
              mode: "cors",
              method: "POST",
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          setInvoices((currentInvoices) =>
            currentInvoices.map((invoice) => {
              if (invoice.invoiceNumber === invoiceNumber) {
                // Remove the deleted item from the invoice's items array
                const updatedItems = invoice.items.filter(
                  (item) => item.id !== itemId
                );

                // Recalculate the new total
                const newTotal = updatedItems.reduce(
                  (total, item) => total + item.total,
                  0
                );

                // Check and update singleInvoice if necessary
                if (
                  singleInvoice &&
                  singleInvoice.invoiceNumber === invoiceNumber
                ) {
                  setSingleInvoice({
                    ...singleInvoice,
                    items: updatedItems,
                    total: newTotal,
                  });
                }

                return { ...invoice, items: updatedItems, total: newTotal };
              }
              return invoice;
            })
          );
        } catch (err) {
          setIsError(err.message);
          console.log(err.message);
        }
      }
    },
    [userId, isAuthenticated, singleInvoice]
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
    singleInvoice,
    toggleNotificationModal,
    sendMessage,
    createInvoiceItems,
    deleteItemById,
    deletedItems,
    setDeletedItems
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
    toggleNotificationModal,
    isNotifiedModalOpen,
    updateInvoiceStatus,
    deletedItems,
    setDeletedItems,
    smsSuccessMessage,
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

export { InvoicesContext, InvoicesProvider };
