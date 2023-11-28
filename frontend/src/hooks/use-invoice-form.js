import { useReducer } from "react";
import { ACTION, initialState, options } from "../helpers/form-constants";
import formReducer from "../helpers/form-reducer";

function useInvoiceForm(createInvoice, updateInvoice, setIsModalOpen) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const arrayOfOptions = options.map((option) => option.option);
  
  const toggleModal = () => setIsModalOpen((current) => !current);

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

  const removeItem = (index) => {
    dispatch({
      type: ACTION.REMOVE_ITEM,
      index,
    });
  };

  const handleSaveChanges = async (state) => {
    // If the invoice is a draft, update its status to 'pending'
    if (state.status === "draft") {
      dispatch({
        type: ACTION.UPDATE_FIELD,
        field: "status",
        value: "pending",
      });

      // Create a local variable representing the new state
      const newState = {
        ...state,
        status: "pending",
      };

      await updateInvoice(newState);
      dispatch({ type: ACTION.RESET_FORM });
      toggleModal();
    }
  };

  const handleDiscardChanges = () => {
    dispatch({ type: ACTION.RESET_FORM });
    toggleModal();
  };

  const handleSaveAsDraft = async (
    state,
    validateForDraft,
    emailRef,
    dateRef
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
    }
  };

  const handleSaveAndSend = async (state) => {
    // If the invoice is a draft, update its status to 'pending'
    if (state.status === "draft") {
      dispatch({
        type: ACTION.UPDATE_FIELD,
        field: "status",
        value: "pending",
      });

      // Create a local variable representing the new state
      const newState = {
        ...state,
        status: "pending",
      };

      await createInvoice(newState);
      dispatch({ type: ACTION.RESET_FORM });
      toggleModal();
    }
  };

  return {
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
    selectedPaymentTermOption,
  };
}
export default useInvoiceForm;
