import PropTypes from "prop-types";
import styles from "./FormItems.module.css";
import Button from "./Button";
import IconDelete from "../assets/icon-delete.svg";

function FormItems({ index, item, onDelete, onUpdate}) {
   // Ensure values are not null
   const itemName = item.name || "";
   const itemQuantity = item.quantity || "";
   const itemPrice = item.price || "";
   const itemTotal = item.total || "";
   const itemId = item.id || "";

  return (
    <>
      <input
        type="text"
        value={itemName}
        onChange={(e) => onUpdate(index, "name", e.target.value)}
        className={`${styles.input} ${styles.firstItem}`}
        required
      />
      <input
        type="number"
        value={itemQuantity}
        min={0}
        onChange={(e) => onUpdate(index, "quantity", e.target.value)}
        className={styles.input}
        required
      />
      <input
        type="number"
        value={itemPrice}
        min={0}
        step={0.01}
        onChange={(e) =>
          onUpdate(index, "price", e.target.value)
        }
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
}

FormItems.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired
};

export default FormItems;
