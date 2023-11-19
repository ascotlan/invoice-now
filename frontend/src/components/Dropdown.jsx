import PropTypes from "prop-types";

function Dropdown({ value, onChange, array}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
    >
      {array.map((item) => (
        <option key={item} value={item}>
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
