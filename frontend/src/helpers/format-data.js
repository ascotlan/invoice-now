// format date
function formatDate(paymentDue) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(paymentDue);
  return date.toLocaleDateString("en-CA", options);
}

// Create a number/currency formatter.
const formatCurrency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

// change text based on userType
const derivedStatus = (userType, status) => {
  return userType === "customer" && status === "pending"
    ? "unpaid"
    : status;
};

export { formatCurrency, formatDate, derivedStatus };
