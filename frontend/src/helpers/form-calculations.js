function calculateTotal(items) {
  return parseFloat(
    items
      .reduce((acc, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        return acc + quantity * price;
      }, 0)
      .toFixed(2)
  );
}

function calculateDueDate(createdAt, paymentTerms) {
  const dueDate = new Date(createdAt);
  dueDate.setDate(dueDate.getDate() + paymentTerms);
  return dueDate.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
}

export {calculateDueDate, calculateTotal}