// format date
function formatDate(paymentDue) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  
  // Parse the date parts
  const [year, month, day] = paymentDue.split('-');
  
  // Create a new date (months are 0-indexed in JavaScript Date)
  const date = new Date(year, month - 1, day);

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

function convertDate(dateString) {
  // Create a Date object using the dateString
  const dateObj = new Date(dateString);

  // Extract year, month, and day from the Date object
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = dateObj.getDate().toString().padStart(2, '0');

  // Return the formatted string
  return `${year}-${month}-${day}`;
}

export { formatCurrency, formatDate, derivedStatus, convertDate};
