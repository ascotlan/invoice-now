import { useEffect, useState, useMemo } from "react";

const useFilter = (userType, invoices, isAuthenticated) => {
  const options = useMemo(() => {
    return userType === "business"
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
  }, [userType]);

  const [filter, setFilter] = useState(options[0].option);

  useEffect(() => {
    if (!isAuthenticated) {
      // Reset filter when user logs out
      setFilter(options[0].option);
    }
  }, [isAuthenticated, options]);

  const handleFilter = (selection) => {
    setFilter(selection);
  };

  const { filterBy } = options.find((option) => option.option === filter) ?? {};

  const filteredInvoices = Array.isArray(invoices) ? invoices.reduce((acc, invoice) => {
    // Check if userType is 'customer' and invoice status is not 'draft'
    if (userType === "customer" && invoice.status === "draft") {
      return acc; // Skip adding this invoice to the accumulator
    }
    // Add invoice to accumulator based on filterBy condition
    if (filterBy === "none" || invoice.status === filterBy) {
      acc.push(invoice);
    }

    return acc;
  }, []) : [];

  return {
    filter,
    handleFilter,
    filteredInvoices,
    options: options.map((option) => option.option),
  };
};

export default useFilter;

