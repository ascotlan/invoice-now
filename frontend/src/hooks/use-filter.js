import { useState } from "react";

const useFilter = (userType, invoices) => {
  const options =
    userType === "business"
      ? [
          { option: "Filter by Status", filterBy: "none" },
          { option: "Draft", filterBy: "draft" },
          { option: "Pending", filterBy: "pending" },
          { option: "Paid", filterBy: "paid" },
        ]
      : [
          { option: "Filter by Status", filterBy: "none" },
          { option: "Unpaid", filterBy: "pending" },
          { option: "Paid", filterBy: "paid" },
        ];

  const [filter, setFilter] = useState(options[0].option);

  const handleFilter = (selection) => {
    setFilter(selection);
  };

  const { filterBy } = options.find((option) => option.option === filter);

  const filteredInvoices = invoices.reduce((acc, invoice) => {
     // Check if userType is 'customer' and invoice status is not 'draft'
     if (userType === "customer" && invoice.status === "draft") {
      return acc; // Skip adding this invoice to the accumulator
    }
    // Add invoice to accumulator based on filterBy condition
    if (filterBy === "none" || invoice.status === filterBy) {
      acc.push(invoice);
    }

    return acc;
  }, []);

  return {
    filter,
    handleFilter,
    filteredInvoices,
    options: options.map((option) => option.option),
  };
};

export default useFilter;
