import {calculateDueDate, calculateTotal} from '../helpers/form-calculations';
import { ACTION, initialState } from './form-constants';

function formReducer(state, action) {
  switch (action.type) {
    case ACTION.UPDATE_FIELD: {
      let updatedState = { ...state };

      // Check if the field to update is a subfield
      if (action.subfield) {
        updatedState = {
          ...state,
          [action.field]: {
            ...state[action.field],
            [action.subfield]: action.value,
          },
        };
      } else {
        updatedState = { ...state, [action.field]: action.value };
      }

      // If the field being updated is 'createdAt' or 'paymentTerms', also update 'paymentDue'
      if (action.field === "createdAt" || action.field === "paymentTerms") {
        const paymentTermsInDays =
          action.field === "paymentTerms" ? action.value : state.paymentTerms;
        const createdAtDate =
          action.field === "createdAt" ? action.value : state.createdAt;

        if (createdAtDate && paymentTermsInDays) {
          updatedState.paymentDue = calculateDueDate(
            createdAtDate,
            paymentTermsInDays
          );
        }
      }
      return updatedState;
    }
    case ACTION.ADD_ITEM: {
      const newStateAdd = {
        ...state,
        items: [...state.items, action.newItem],
      };
      newStateAdd.total = calculateTotal(newStateAdd.items);
      return newStateAdd;
    }

    case ACTION.UPDATE_ITEM: {
      const updatedItems = state.items.map((item, index) =>
        index === action.index
          ? { ...item, [action.field]: action.value }
          : item
      );
      const newStateUpdate = {
        ...state,
        items: updatedItems,
      };
      newStateUpdate.total = calculateTotal(newStateUpdate.items);
      return newStateUpdate;
    }

    case ACTION.REMOVE_ITEM: {
      const filteredItems = state.items.filter(
        (_, index) => index !== action.index
      );
      const newStateRemove = {
        ...state,
        items: filteredItems,
      };
      newStateRemove.total = calculateTotal(newStateRemove.items);
      return newStateRemove;
    }
    case ACTION.RESET_FORM:
      return initialState;
    case ACTION.INITIALIZE_FORM:
      return { ...action.payload };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default formReducer;