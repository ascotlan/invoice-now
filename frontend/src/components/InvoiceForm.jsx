import PropTypes from "prop-types";
import styles from "./InvoiceForm.module.css";
import Dropdown from "../components/Dropdown";
import Button from "./Button";
import FormItems from "./FormItems";
import useInvoicesContext from "../hooks/use-invoices-context";
import React, { useEffect, useRef, useState } from "react";
import { convertDate } from "../helpers/format-data";

function InvoiceForm({ isEditMode = false }) {
  const [actionType, setActionType] = useState(null);
  const [message, setMessage] = useState("");
  const emailRef = useRef();
  const dateRef = useRef();
  const itemRefs = useRef([]);

  const {
    formState,
    updateItem,
    removeItem,
    addItem,
    updateField,
    arrayOfOptions,
    handleSelection,
    handleSaveChanges,
    handleSaveAndSend,
    handleSaveAsDraft,
    selectedPaymentTermOption,
    handleDiscardChanges,
  } = useInvoicesContext();

  useEffect(() => {
    itemRefs.current = formState.items.map((_, index) => {
      if (itemRefs.current[index]) {
        // Use existing refs for existing items
        return itemRefs.current[index];
      } else {
        // Initialize new refs for new items
        return {
          nameRef: React.createRef(),
          quantityRef: React.createRef(),
          priceRef: React.createRef(),
        };
      }
    });
  }, [formState.items]);

  const derivedDate = isEditMode
    ? convertDate(formState.createdAt)
    : formState.createdAt;

  const validateForDraft = () => {
    // First, check the validity of email and date fields
    const isEmailAndDateValid =
      emailRef.current.checkValidity() && dateRef.current.checkValidity();

    // If the items array is empty and email and date fields are valid, return true
    if (formState.items.length === 0) {
      return isEmailAndDateValid;
    }

    // Validate each item if items array is not empty
    const everyItemValid = itemRefs.current.every((refs) => {
      return (
        refs.nameRef?.current?.checkValidity() &&
        refs.quantityRef?.current?.checkValidity() &&
        refs.priceRef?.current?.checkValidity()
      );
    });

    // Return true only if both email, date, and all items are valid
    return isEmailAndDateValid && everyItemValid;
  };

  // handle the iteration over itemRefs and calls .reportValidity()
  const reportValidityForItems = () => {
    itemRefs.current.forEach(({ nameRef, quantityRef, priceRef }) => {
      if (nameRef?.current && !nameRef.current.checkValidity()) {
        nameRef.current.reportValidity();
      }
      if (quantityRef?.current && !quantityRef.current.checkValidity()) {
        quantityRef.current.reportValidity();
      }
      if (priceRef?.current && !priceRef.current.checkValidity()) {
        priceRef.current.reportValidity();
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    if (formState.items.length === 0) {
      setMessage("Must add at least 1 item to invoice");
    } else if (form.checkValidity()) {
      setMessage("Processing form...");

      switch (actionType) {
        case "saveChanges": {
          //create nullIdItem array and pass it as argument
          const nullIdItems = formState.items.filter(
            (item) => !item.id && item.id !== 0
          );

          handleSaveChanges(formState, nullIdItems);
          break;
        }
        case "saveSend":
          handleSaveAndSend(formState);
          break;
        default:
          console.log("Unknown action type");
      }
    } else {
      setMessage("Form is invalid. Please correct the errors.");
      form.reportValidity();
    }
  };

  //items to render
  const renderedItems = formState.items.map((item, index) => (
    <FormItems
      key={index}
      item={item}
      refs={{
        nameRef: itemRefs.current[index]?.nameRef,
        quantityRef: itemRefs.current[index]?.quantityRef,
        priceRef: itemRefs.current[index]?.priceRef,
      }}
      index={index}
      onUpdate={updateItem}
      onDelete={removeItem}
    />
  ));

  const renderedButtons = isEditMode ? (
    <div className={styles.edit}>
      <div className={styles.editOrCancel}>
        <Button variant="cancel" onClick={handleDiscardChanges}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="saveChanges"
          onClick={() => setActionType("saveChanges")}
        >
          Save Changes
        </Button>
      </div>
    </div>
  ) : (
    <div className={styles.create}>
      <Button variant="cancel" onClick={handleDiscardChanges}>
        Discard
      </Button>
      <div className={styles.createAndSave}>
        <Button
          variant="saveDraft"
          onClick={() =>
            handleSaveAsDraft(
              formState,
              validateForDraft,
              emailRef,
              dateRef,
              setMessage,
              reportValidityForItems
            )
          }
        >
          Save as Draft
        </Button>
        <Button
          type="submit"
          variant="saveSend"
          onClick={() => setActionType("saveSend")}
        >
          Save & Send
        </Button>
      </div>
    </div>
  );

  return (
    <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
      <div className={styles.contents}>
        <p className={`headingMedium`}>
          {isEditMode ? (
            <>
              Edit <span className={styles.highlight}>#</span>
              {formState.invoiceNumber}
            </>
          ) : (
            "New Invoice"
          )}
        </p>
        <p className={`headingSmall ${styles.sectionHeading}`}>Bill From</p>
        <label className={styles.label}>Street Address</label>
        <input
          type="text"
          name="businessAddress.street"
          className={styles.input}
          value={formState.businessAddress.street}
          onChange={updateField}
          required
        />
        <div className={styles.formFlexbox}>
          <div>
            <label className={`margin-bottom-helper ${styles.label}`}>
              City
            </label>
            <input
              type="text"
              name="businessAddress.city"
              className={styles.input}
              value={formState.businessAddress.city}
              onChange={updateField}
              required
            />
          </div>
          <div>
            <label className={`margin-bottom-helper ${styles.label}`}>
              Post Code
            </label>
            <input
              type="text"
              name="businessAddress.postCode"
              className={styles.input}
              value={formState.businessAddress.postCode}
              onChange={updateField}
              required
            />
          </div>
          <div>
            <label className={`margin-bottom-helper ${styles.label}`}>
              Country
            </label>
            <input
              type="text"
              name="businessAddress.country"
              className={styles.input}
              value={formState.businessAddress.country}
              onChange={updateField}
              required
            />
          </div>
        </div>
        <label className={styles.label}>
          Business&apos;s Phone Number (format: +15556667777)
        </label>
        <input
          type="tel"
          name="businessAddress.phoneNumber"
          className={styles.input}
          value={formState.businessAddress.phoneNumber}
          onChange={updateField}
          pattern="\+[0-9]{1,3}[0-9]{10}"
          title="Phone number must be in the format: +15556667777"
          required
        />
        <p className={`headingSmall ${styles.sectionHeading}`}>Bill To</p>
        <label className={styles.label}>Client Name</label>
        <input
          type="text"
          name="customerName"
          className={styles.input}
          value={formState.customerName}
          onChange={updateField}
          required
        />
        <label className={styles.label}>
          Client&apos;s Phone Number (format: +15556667777)
        </label>
        <input
          type="tel"
          name="customerAddress.phoneNumber"
          className={styles.input}
          value={formState.customerAddress.phoneNumber}
          onChange={updateField}
          pattern="\+[0-9]{1,3}[0-9]{10}"
          title="Phone number must be in the format: +15556667777"
          required
        />
        <label className={styles.label}>Client&apos;s Email*</label>
        <input
          type="email"
          name="customerEmail"
          value={formState.customerEmail}
          onChange={updateField}
          className={styles.input}
          ref={emailRef}
          disabled={isEditMode}
          required={!isEditMode}
        />
        <label className={styles.label}>Street Address</label>
        <input
          type="text"
          name="customerAddress.street"
          value={formState.customerAddress.street}
          onChange={updateField}
          className={styles.input}
          required
        />
        <div className={styles.formFlexbox}>
          <div>
            <label className={`margin-bottom-helper ${styles.label}`}>
              City
            </label>
            <input
              type="text"
              name="customerAddress.city"
              value={formState.customerAddress.city}
              onChange={updateField}
              className={styles.input}
              required
            />
          </div>
          <div>
            <label className={`margin-bottom-helper ${styles.label}`}>
              Post Code
            </label>
            <input
              type="text"
              name="customerAddress.postCode"
              value={formState.customerAddress.postCode}
              onChange={updateField}
              className={styles.input}
              required
            />
          </div>
          <div>
            <label className={`margin-bottom-helper ${styles.label}`}>
              Country
            </label>
            <input
              name="customerAddress.country"
              value={formState.customerAddress.country}
              onChange={updateField}
              type="text"
              className={styles.input}
              required
            />
          </div>
        </div>
        <div
          className={`margin-top-helper ${styles.formFlexbox} ${styles.formFlexbox2}`}
        >
          <div>
            <label className={`margin-bottom-helper ${styles.label}`}>
              Issue Date
            </label>
            <input
              type="date"
              name="createdAt"
              value={derivedDate}
              onChange={updateField}
              className={`${styles.datePicker} ${styles.input}`}
              ref={dateRef}
              disabled={isEditMode}
              required={!isEditMode}
            />
          </div>
          <div>
            <label className={`margin-bottom-helper ${styles.label}`}>
              Payment Terms
            </label>
            <Dropdown
              value={selectedPaymentTermOption}
              onChange={handleSelection}
              array={arrayOfOptions}
              type="terms"
            />
          </div>
        </div>
        <label className={styles.label}>Project Description</label>
        <input
          name="description"
          value={formState.description}
          onChange={updateField}
          type="text"
          className={styles.input}
          required
        />
        <p className={`headingSmall ${styles.sectionHeading}`}>Item List</p>
        <div className={styles.items}>
          <p>Item Name</p>
          <p>Qty.</p>
          <p>Price</p>
          <p>Total</p>
          {renderedItems}
        </div>
        <Button variant="item" onClick={() => addItem()}>
          + Add New Item
        </Button>
        {renderedButtons}
        <div className={styles.warning}>{message}</div>
      </div>
    </form>
  );
}

InvoiceForm.propTypes = {
  isEditMode: PropTypes.bool,
};

export default InvoiceForm;
