import PropTypes from "prop-types";
import styles from "./FormItems.module.css";
import Button from "./Button";
import IconDelete from "../assets/icon-delete.svg";

const FormItems = ({ index, item, onDelete, onUpdate, refs }) => {
  // Ensure values are not null
  const itemName = item.name || "";
  const itemQuantity = item.quantity || "";
  const itemPrice = item.price || "";
  const itemTotal = item.total || "";
  const itemId = item.id || "";

  // Destructure refs for each field
  const { nameRef, quantityRef, priceRef } = refs;

  return (
    <>
      <input
        ref={nameRef} // Forwarding the ref to this input
        type="text"
        value={itemName}
        onChange={(e) => onUpdate(index, "name", e.target.value)}
        className={`${styles.input} ${styles.firstItem}`}
        required
      />
      <input
        ref={quantityRef}
        type="number"
        value={itemQuantity}
        min={0}
        onChange={(e) => onUpdate(index, "quantity", e.target.value)}
        className={styles.input}
        required
      />
      <input
        ref={priceRef}
        type="number"
        value={itemPrice}
        min={0}
        step={0.01}
        onChange={(e) => onUpdate(index, "price", e.target.value)}
        className={styles.input}
        required
      />
      <input
        type="number"
        value={itemTotal}
        className={styles.input}
        readOnly
      />
      <Button
        variant="deleteItem"
        onClick={() => onDelete(index, itemId)}
        icon={<img src={IconDelete} alt="delete icon" />}
      />
    </>
  );
};

FormItems.displayName = "FormItems"; // Setting displayName

FormItems.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  refs: PropTypes.shape({
    nameRef: PropTypes.object,
    quantityRef: PropTypes.object,
    priceRef: PropTypes.object,
  }).isRequired,
};

export default FormItems;
