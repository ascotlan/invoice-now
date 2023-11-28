import PropTypes from "prop-types";
import styles from "./FormItems.module.css";
import Button from "./Button";
import IconDelete from "../assets/icon-delete.svg";

function FormItems({ index, item, onDelete, onUpdate }) {
  return (
    <>
      <input
        type="text"
        value={item.name}
        onChange={(e) => onUpdate(index, "name", e.target.value)}
        className={`${styles.input} ${styles.firstItem}`}
        required
      />
      <input
        type="number"
        value={item.quantity}
        min={0}
        onChange={(e) => onUpdate(index, "quantity", e.target.value)}
        className={styles.input}
        required
      />
      <input
        type="number"
        value={item.price}
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
        value={item.total}
        className={styles.input}
        readOnly
      />
      <Button
        variant="deleteItem"
        onClick={() => onDelete(index)}
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
};

export default FormItems;
