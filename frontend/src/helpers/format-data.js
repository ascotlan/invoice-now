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

export {formatCurrency, formatDate};