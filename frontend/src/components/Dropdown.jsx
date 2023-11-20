import PropTypes from "prop-types";
import styles from './Dropdown.module.css';

function Dropdown({ value, onChange, array}) {
  return (
    <select
      className={styles.filter}
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
    >
      {array.map((item) => (
        <option className={styles.filterOption} key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

Dropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  array: PropTypes.array.isRequired
};

export default Dropdown
