import PropTypes from "prop-types";

function BulletPoint({ fill }) {
  return (
    <svg
      fill={fill}
      width="32px"
      height="32px"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z" />
    </svg>
  );
}

BulletPoint.propTypes = {
  fill: PropTypes.string.isRequired,
};

export default BulletPoint;
