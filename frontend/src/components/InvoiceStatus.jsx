import PropTypes from "prop-types"; 
function InvoiceStatus({status}) {
  return (
    <div>
      {status}
    </div>
  );
}

InvoiceStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

export default InvoiceStatus;
