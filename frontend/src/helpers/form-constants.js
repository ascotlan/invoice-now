import { calculateDueDate } from "./form-calculations";

const options = [
  { option: "Net 1 day", duration: 1 },
  { option: "Net 7 Days", duration: 7 },
  { option: "Net 14 Days", duration: 14 },
  { option: "Net 30 Days", duration: 30 },
];

const ACTION = {
  UPDATE_FIELD: "UPDATE_FIELD",
  ADD_ITEM: "ADD_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  RESET_FORM: "RESET_FORM"
};

const initialState = {
  createdAt: "",
  paymentDue: calculateDueDate(
    new Date().toISOString().split("T")[0],
    options[3].duration
  ),
  description: "",
  paymentTerms: options[3].duration,
  customerName: "",
  customerEmail: "",
  status: "draft",
  businessAddress: {
    city: "",
    street: "",
    country: "",
    postCode: "",
    phoneNumber: "",
  },
  customerAddress: {
    city: "",
    street: "",
    country: "",
    postCode: "",
    phoneNumber: "",
  },
  items: [],
  total: null,
};

export {options, initialState, ACTION}