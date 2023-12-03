import PropTypes from "prop-types";
import styles from "./InvoiceForm.module.css";
import Dropdown from "../components/Dropdown";
import Button from "./Button";
import FormItems from "./FormItems";
import useInvoicesContext from "../hooks/use-invoices-context";
import { useRef, useState } from "react";
import { convertDate } from "../helpers/format-data";

function InvoiceForm({ isEditMode = false }) {
  const [actionType, setActionType] = useState(null);
  const [message, setMessage] = useState("");
  const emailRef = useRef();
  const dateRef = useRef();

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

  const derivedDate = isEditMode
    ? convertDate(formState.createdAt)
    : formState.createdAt;

  const validateForDraft = () => {
    // Only email is required for draft
    return emailRef.current.checkValidity() && dateRef.current.checkValidity();
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
      index={index}
      onUpdate={updateItem}
      onDelete={removeItem}
      isEditMode={isEditMode}
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
            handleSaveAsDraft(formState, validateForDraft, emailRef, dateRef)
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
        <label className={styles.label}>Business&apos;s Phone Number</label>
        <input
          type="tel"
          name="businessAddress.phoneNumber"
          className={styles.input}
          value={formState.businessAddress.phoneNumber}
          onChange={updateField}
          title="Phone number must be in the format: xxx-xxx-xxxx"
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
        <label className={styles.label}>Client&apos;s Phone Number</label>
        <input
          type="tel"
          name="customerAddress.phoneNumber"
          className={styles.input}
          value={formState.customerAddress.phoneNumber}
          onChange={updateField}
          title="Phone number must be in the format: xxx-xxx-xxxx"
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
