import { useEffect, useReducer } from "react";
import { ACTION, initialState, options } from "../helpers/form-constants";
import formReducer from "../helpers/form-reducer";
import { customerMessage } from "../helpers/sms-message";

function useInvoiceForm(
  createInvoice,
  updateInvoice,
  setIsModalOpen,
  updateInvoiceStatus,
  invoiceData = null,
  toggleNotificationModal,
  sendMessage,
  createInvoiceItems,
  deleteItemById,
  deletedItems,
  setDeletedItems
) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const arrayOfOptions = options.map((option) => option.option);
  const toggleModal = () => setIsModalOpen((current) => !current);

  // Effect to initialize form state when invoiceData changes
  useEffect(() => {
    if (invoiceData) {
      dispatch({ type: ACTION.INITIALIZE_FORM, payload: invoiceData });
    }
  }, [invoiceData]);

  //derived state
  const selectedPaymentTermOption =
    options.find((option) => option.duration === state.paymentTerms)?.option ||
    "";

  const updateField = (event) => {
    const { name, value } = event.target;
    const [field, subfield] = name.split(".");

    if (subfield) {
      dispatch({
        type: ACTION.UPDATE_FIELD,
        field,
        subfield,
        value,
      });
    } else {
      dispatch({
        type: ACTION.UPDATE_FIELD,
        field: name,
        value,
      });
    }
  };

  const handleSelection = (selection) => {
    // Find the option with the selected text
    const selectedOption = options.find(
      (option) => option.option === selection
    );

    dispatch({
      type: ACTION.UPDATE_FIELD,
      field: "paymentTerms",
      value: selectedOption ? selectedOption.duration : "",
    });
  };

  const addItem = () => {
    dispatch({
      type: ACTION.ADD_ITEM,
      newItem: { name: "", quantity: "", price: "", total: 0 },
    });
  };

  const updateItem = (index, field, value) => {
    let newValue = value;

    if (field === "quantity" || field === "price") {
      newValue = value ? parseFloat(value) : "";
    }

    dispatch({
      type: ACTION.UPDATE_ITEM,
      index,
      field,
      value: newValue,
    });

    if (field === "quantity" || field === "price") {
      const updatedItem = { ...state.items[index], [field]: newValue };
      const itemQuantity = updatedItem.quantity || 0;
      const itemPrice = updatedItem.price || 0;
      const newTotal = parseFloat((itemQuantity * itemPrice).toFixed(2));

      dispatch({
        type: ACTION.UPDATE_ITEM,
        index,
        field: "total",
        value: newTotal,
      });
    }
  };

  const removeItem = (index, itemId) => {
    // Check if itemId is not undefined, null, or an empty string
    if (itemId !== undefined && itemId !== null && itemId !== "") {
      if (Array.isArray(deletedItems)) {
        // If deletedItems is an array, add the itemId to it
        setDeletedItems([...deletedItems, itemId]);
      } else {
        // If deletedItems is not an array, initialize it with the current itemId
        setDeletedItems([itemId]);
      }
    }

    // Dispatch action to remove the item from the state
    dispatch({
      type: ACTION.REMOVE_ITEM,
      index,
    });
  };

  const handleSaveChanges = async (state, nullIdItems) => {
    try {
      // Create a local variable representing the new state
      const newState = {
        ...state,
        status: "pending",
      };

      await updateInvoice(newState);
      // nullIdItems -> array of newly created items with null/undefined id
      if (nullIdItems.length) {
        await createInvoiceItems(newState.invoiceNumber, nullIdItems);
      }

      if (deletedItems.length) {
        await Promise.all(
          deletedItems.map((itemId) =>
            deleteItemById(newState.invoiceNumber, itemId)
          )
        );
      }

      setDeletedItems([]);
      dispatch({ type: ACTION.RESET_FORM });
      toggleModal();
      await sendMessage(state, customerMessage);
      toggleNotificationModal();
    } catch (error) {
      console.error("Error updating invoice", error);
      // Handle error, provide user feedback
    }
  };

  const handleChangeInvoiceStatus = async () => {
    if (state.status === "pending") {
      try {
        // Create a local variable representing the new state
        const newState = {
          ...state,
          status: "paid",
        };

        await updateInvoiceStatus(newState);
        dispatch({
          type: ACTION.UPDATE_FIELD,
          field: "status",
          value: "paid",
        });
      } catch (error) {
        console.error("Error updating invoice status", error);
        // Handle error, provide user feedback
      }
    }
  };

  const handleDiscardChanges = async () => {
    // Check if in edit mode (i.e., invoiceData is not null)
    if (invoiceData) {
      // If in edit mode, reset form with the original invoice data
      dispatch({ type: ACTION.INITIALIZE_FORM, payload: invoiceData });
    } else {
      // If not in edit mode, reset form to initial state
      dispatch({ type: ACTION.RESET_FORM });
    }
    setDeletedItems([]);
    toggleModal();
  };

  const handleSaveAsDraft = async (
    state,
    validateForDraft,
    emailRef,
    dateRef,
    clientNameRef,
    clientPhoneRef,
    setMessage,
    reportValidityCallback
  ) => {
    if (validateForDraft()) {
      await createInvoice(state);
      dispatch({ type: ACTION.RESET_FORM });
      toggleModal();
    } else {
      if (!emailRef.current.checkValidity()) {
        emailRef.current.reportValidity();
      }

      if (!dateRef.current.checkValidity()) {
        dateRef.current.reportValidity();
      }

      if (!clientNameRef.current.checkValidity()) {
        clientNameRef.current.reportValidity();
      }

      if (!clientPhoneRef.current.checkValidity()) {
        clientPhoneRef.current.reportValidity();
      }

      // Check if the items array is not empty and reportValidityCallback is provided
      if (
        state.items.length !== 0 &&
        reportValidityCallback &&
        typeof reportValidityCallback === "function"
      ) {
        setMessage("Must add at least 1 item to invoice");
        reportValidityCallback();
      }
    }
  };

  const handleSaveAndSend = async (state) => {
    if (state.status === "draft") {
      // Create a local variable representing the new state
      const newState = {
        ...state,
        status: "pending",
      };

      try {
        await createInvoice(newState);
        dispatch({ type: ACTION.RESET_FORM });
        toggleModal();
        await sendMessage(state, customerMessage);
        toggleNotificationModal();
      } catch (error) {
        console.error("Error saving and sending invoice", error);
        // Handle error, provide user feedback
      }
    }
  };

  return {
    dispatch,
    formState: state,
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
    handleChangeInvoiceStatus,
    selectedPaymentTermOption,
  };
}

export default useInvoiceForm;
