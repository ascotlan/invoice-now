const pool = require("../index");

const getAllInvoices = async(userId) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
  invoices.invoice_number AS "invoiceId",
  TO_CHAR(invoices.created_at, 'MM/DD/YYYY') AS "createdAt",
  TO_CHAR(invoices.due_date, 'MM/DD/YYYY') AS "paymentDue",
  invoices.description,
  invoices.payment_terms AS "paymentTerms",
  users_business.name AS "businessName",
  users_customer.name AS "customerName",
  users_customer.email AS "customerEmail",
  invoices.status,
  jsonb_build_object(
    'street', users_business.street,
    'city', users_business.city,
    'postCode', users_business.postal_code,
    'country', users_business.country
  ) AS "businessAddress",
  jsonb_build_object(
    'street', users_customer.street,
    'city', users_customer.city,
    'postCode', users_customer.postal_code,
    'country', users_customer.country
  ) AS "customerAddress",
  jsonb_agg(
    jsonb_build_object(
      'name', invoice_items.name,
      'quantity', invoice_items.quantity,
      'price', invoice_items.price,
      'total', invoice_items.total
    )
  ) AS items,
  SUM(invoice_items.total) AS "total"
FROM invoices
JOIN users AS users_customer ON invoices.customer_user_id = users_customer.id
JOIN users AS users_business ON invoices.business_user_id = users_business.id
LEFT JOIN invoice_items ON invoices.id = invoice_items.invoice_id
WHERE invoices.business_user_id = $1 OR invoices.customer_user_id = $1
GROUP BY invoices.id, users_customer.id, users_business.id
ORDER BY invoices.id;
    `,
      [userId]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllInvoices,
  // Add other invoice-related queries as needed
};
