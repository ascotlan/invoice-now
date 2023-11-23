const { InvoiceNotFoundError, ItemNotFoundError } = require("../../util/errorHelper");
const pool = require("../index");

/**
 * Retrieves all invoices associated with a given user ID.
 *
 * @param {number} userId - The unique identifier of the user.
 * @throws {Error} If any error occurs during the retrieval process.
 * @returns {Array<Object>} An array of invoice objects.
 */
const getAllInvoices = async(userId) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
  invoices.id as "id",
  invoices.invoice_number AS "invoiceNumber",
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
      'id', invoice_items.id,
      'name', invoice_items.name,
      'quantity', invoice_items.quantity,
      'price', invoice_items.price,
      'total', invoice_items.total
    )
  ) AS items,
  SUM(invoice_items.total)::int AS "total"
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
    throw Error(`Error fetching all invoices`);
  }
};

/**
 * Saves an invoice to the database and returns the generated invoice ID.
 *
 * @async
 * @param {Object} invoiceModel - The invoice model containing information to be saved.
 * @throws {Error} Throws an error if there is an issue inserting the invoice.
 * @returns {Promise<?string>} A promise that resolves to the generated invoice ID, or `null` if unsuccessful.
 */
const saveInvoice = async(invoiceModel) => {
  console.log(`Invoice model -> ${JSON.stringify(invoiceModel)}`);
  try {
    const {
      invoiceNumber,
      createdAt,
      description,
      status,
      paymentTerms,
      paymentDue,
      businessUserId,
      customerId
    } = invoiceModel;

    const { rows } = await pool.query(
      `INSERT INTO invoices(
        invoice_number, created_at, description, 
        status, payment_terms, due_date, business_user_id, customer_user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`,
      [
        invoiceNumber,
        createdAt,
        description,
        status,
        paymentTerms,
        paymentDue,
        businessUserId,
        customerId
      ]
    );

    const invoiceId = rows[0].id;
    console.log(`Saved new invoice with ID -> [${invoiceId}] to the database.`);
    return invoiceId;
  } catch (error) {
    throw Error(`Error saving invoice -> [${JSON.stringify(invoiceModel)}]`);
  }
};


/**
 * Updates an existing invoice and its associated items in the database.
 *
 * @param {Object} invoice - The invoice object to be updated.
 * @throws {Error} If any error occurs during the update process.
 * @returns {Object} The updated invoice object.
 */
const updateInvoice = async(invoice) => {
  console.log(`Invoice before update -> ${JSON.stringify(invoice)}`);
  try {
    const {
      id,
      invoiceNumber,
      createdAt,
      paymentDue,
      description,
      paymentTerms,
      status,
      items
    } = invoice;

    // Update invoices table
    const { rows: updatedInvoices } = await pool.query(
      `UPDATE invoices
       SET
         invoice_number = $1,
         created_at = TO_TIMESTAMP($2, 'YYYY-MM-DD'),
         due_date = TO_TIMESTAMP($3, 'YYYY-MM-DD'),
         description = $4,
         payment_terms = $5,
         status = $6
       WHERE id = $7
       RETURNING *;`,
      [
        invoiceNumber,
        createdAt,
        paymentDue,
        description,
        paymentTerms,
        status,
        id
      ]
    );

    const updatedInvoice = updatedInvoices[0];
    console.log(`Updated invoice -> ${JSON.stringify(updatedInvoice)}`);

    // Update invoice_items table
    await Promise.all(
      items.map(async(item) => {
        const { rows: updatedItemRows } = await pool.query(
          `UPDATE invoice_items
           SET
             name = $1,
             quantity = $2,
             price = $3,
             total = $4
           WHERE invoice_id = $5 AND id = $6
           RETURNING id, name, quantity, price, total;`,
          [
            item.name,
            item.quantity,
            item.price,
            item.total,
            updatedInvoice.id,
            item.id
          ]
        );
        const updatedItem = updatedItemRows[0];
        console.log(`Updated item -> ${JSON.stringify(updatedItem)}`);
      })
    );

    return updatedInvoice;
  } catch (error) {
    throw Error(`Error updating invoice -> ${error}`);
  }
};


/**
 * Saves a new invoice item to the database.
 *
 * @param {string} name - The name of the invoice item.
 * @param {number} quantity - The quantity of the invoice item.
 * @param {number} price - The price of the invoice item.
 * @param {number} total - The total cost of the invoice item.
 * @param {number} invoiceId - The unique identifier of the associated invoice.
 * @throws {Error} If any error occurs during the process.
 * @returns {Object} The saved invoice item details.
 */
const saveInvoiceItem = async(name, quantity, price, total, invoiceId) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO invoice_items(
        name, quantity, price, total, invoice_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING id, name, quantity, price, total;`,
      [name, quantity, price, total, invoiceId]
    );
    return rows[0];
  } catch (error) {
    throw Error(`Error saving invoice item: ${error}. Invoice ID -> ${invoiceId}`);
  }
};

/**
 * Fetches an invoice by its unique identifier.
 *
 * @param {number} id - The unique identifier of the invoice.
 * @throws {Error} If any error occurs during the process.
 * @returns {Object|null} The fetched invoice details or null if the invoice is not found.
 */
const getInvoiceById = async(id) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM invoices WHERE id = $1;`,
      [id]
    );
    return rows[0];
  } catch (error) {
    throw Error(`Error fetching invoice: ${error}. Invoice ID -> ${id}`);
  }
};

/**
 * Fetches an invoice by its invoice number, including associated details.
 *
 * @param {string} invoiceNumber - The unique identifier of the invoice.
 * @throws {Error} If any error occurs during the process.
 * @returns {Object|null} The fetched invoice details or null if the invoice is not found.
 */
const getInvoiceByInvoiceNumber = async(invoiceNumber) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
  invoices.id as "id",
  invoices.invoice_number AS "invoiceNumber",
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
      'id', invoice_items.id,
      'name', invoice_items.name,
      'quantity', invoice_items.quantity,
      'price', invoice_items.price,
      'total', invoice_items.total
    )
  ) AS items,
  SUM(invoice_items.total)::int AS "total"
FROM invoices
JOIN users AS users_customer ON invoices.customer_user_id = users_customer.id
JOIN users AS users_business ON invoices.business_user_id = users_business.id
LEFT JOIN invoice_items ON invoices.id = invoice_items.invoice_id
WHERE invoices.invoice_number = $1
GROUP BY invoices.id, users_customer.id, users_business.id
ORDER BY invoices.id;
    `,
      [invoiceNumber]
    );
    return rows[0];
  } catch (error) {
    throw Error(`Error fetching invoice -> [${error}]. Invoice number -> [${invoiceNumber}]`);
  }
};

/**
 * Deletes an invoice and its associated items by invoice number.
 *
 * @param {string} invoiceNumber - The invoice number to identify the invoice.
 * @throws {InvoiceNotFoundError} If the invoice with the specified number is not found.
 * @throws {Error} If any other error occurs during the process.
 * @returns {void}
 */
const deleteInvoiceByInvoiceNumber = async(invoiceNumber) => {
  console.log(`Delete - invoice number -> ${invoiceNumber}`);
  try {
    const { rows } = await pool.query(
      `SELECT id FROM invoices WHERE invoice_number = $1;`,
      [invoiceNumber]
    );

    if (rows.length === 0) {
      throw new InvoiceNotFoundError(`Invoice with number ${invoiceNumber} not found.`, 404);
    }

    const invoiceId = rows[0].id;

    const { rows: itemRows } = await pool.query(
      `SELECT id FROM invoice_items WHERE invoice_id = $1;`,
      [invoiceId]
    );

    await pool.query(`DELETE FROM invoice_items WHERE invoice_id = $1;`, [invoiceId])
      .then(() =>
        pool.query(`DELETE FROM invoices WHERE id = $1;`, [invoiceId])
      )
      .then((result) => {
        const rowCount = result.rowCount;
        if (rowCount > 0) {
          console.log(`Deleted invoice with ID -> ${invoiceId} and number -> ${invoiceNumber}`);
          console.log(`Deleted invoice item IDs -> ${itemRows.map(item => item.id).join(', ')}`);
        } else {
          console.log(`Invoice with number ${invoiceNumber} not found.`);
        }
      });
  } catch (error) {
    throw Error(`Error deleting invoice -> [${error}]. Invoice number -> [${invoiceNumber}]`);
  }
};

const getInvoiceItemsByInvoiceNumber = async(invoiceNumber) => {
  const { rows } = await pool.query(`SELECT
  invoice_items.id AS "id",
  invoice_items.name,
  invoice_items.quantity,
  invoice_items.price,
  invoice_items.total
FROM invoice_items
JOIN invoices ON invoices.id = invoice_items.invoice_id
WHERE invoices.invoice_number = $1
ORDER BY invoice_items.id;
`, [invoiceNumber]);
  return rows;
};

const saveInvoiceItemsByInvoiceNumber = async(invoiceNumber, items) => {
  const { rows: invoiceRows } = await pool.query(
    'SELECT id FROM invoices WHERE invoice_number = $1;',
    [invoiceNumber]
  );

  if (invoiceRows.length === 0) {
    throw new InvoiceNotFoundError(`Invoice with number ${invoiceNumber} not found.`, 404);
  }

  const invoiceId = invoiceRows[0].id;

  const rowsArray = await Promise.all(
    items.map(async(item) => {
      const { name, quantity, price, total } = item;
      const { rows } = await pool.query(
        `INSERT INTO invoice_items (name, quantity, price, total, invoice_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *;`,
        [name, quantity, Math.round(price * 100), Math.round(total * 100), invoiceId]
      );
      return rows;
    })
  );

  const flatRows = rowsArray.flat();
  console.log(`Saved items for invoice with number -> ${invoiceNumber}`);
  return flatRows;
};

/**
 * Updates an item in the invoice_items table by invoice number and item ID.
 * @param {string} invoiceNumber - The invoice number.
 * @param {number} invoiceItemId - The ID of the item to be updated.
 * @param {Object} updatedItem - The updated item data.
 * @returns {Object} The updated item with its new data.
 * @throws {InvoiceNotFoundError} If the invoice with the specified number is not found.
 * @throws {ItemNotFoundError} If the item with the specified ID is not found for the given invoice number.
 * @throws {Error} If any other error occurs during the process.
 */
const updateItemByInvoiceNumberAndInvoiceItemId = async(invoiceNumber, invoiceItemId, updatedItem) => {
  // Fetch invoice id based on invoice number
  const { rows: invoiceRows } = await pool.query(
    'SELECT id FROM invoices WHERE invoice_number = $1;',
    [invoiceNumber]
  );

  if (invoiceRows.length === 0) {
    throw new InvoiceNotFoundError(`Invoice with number ${invoiceNumber} not found.`, 404);
  }

  const invoiceId = invoiceRows[0].id;

  // Fetch item by item id
  const { rows: itemRows } = await pool.query(
    'SELECT * FROM invoice_items WHERE id = $1 AND invoice_id = $2;',
    [invoiceItemId, invoiceId]
  );

  if (itemRows.length === 0) {
    throw new ItemNotFoundError(`Item with ID ${invoiceItemId} not found for invoice ${invoiceNumber}.`, 404);
  }

  // Update the item in the invoice_items table
  const { rows } = await pool.query(
    `UPDATE invoice_items
       SET
         name = $1,
         quantity = $2,
         price = $3,
         total = $4
       WHERE invoice_id = $5 AND id = $6
       RETURNING id, name, quantity, price, total;`,
    [
      updatedItem.name,
      updatedItem.quantity,
      Math.round(updatedItem.price * 100),
      Math.round(updatedItem.total * 100),
      invoiceId,
      invoiceItemId
    ]
  );

  const updatedRows = rows[0];
  console.log(`Updated item with ID -> ${updatedRows.id}`);
  return updatedRows;
};

/**
 * Deletes an item from the invoice_items table by invoice number and item ID.
 * @param {string} invoiceNumber - The invoice number.
 * @param {number} itemId - The ID of the item to be deleted.
 * @throws {InvoiceNotFoundError} If the invoice with the specified number is not found.
 * @throws {ItemNotFoundError} If the item with the specified ID is not found for the given invoice number.
 * @throws {Error} If any other error occurs during the process.
 */
const deleteByInvoiceIdAndItemId = async(invoiceNumber, itemId) => {
  const { rows: invoiceRows } = await pool.query(
    'SELECT id FROM invoices WHERE invoice_number = $1;',
    [invoiceNumber]
  );

  if (invoiceRows.length === 0) {
    throw new InvoiceNotFoundError(`Invoice with number ${invoiceNumber} not found.`, 404);
  }

  const invoiceId = invoiceRows[0].id;

  const { rowCount: itemRowCount } = await pool.query(
    'SELECT * FROM invoice_items WHERE invoice_id = $1 AND id = $2;',
    [invoiceId, itemId]
  );

  if (itemRowCount === 0) {
    throw new ItemNotFoundError(`Item with ID ${itemId} not found for invoice Number ${invoiceNumber}.`, 404);
  }

  await pool.query(
    'DELETE FROM invoice_items WHERE invoice_id = $1 AND id = $2;',
    [invoiceId, itemId]
  );

  console.log(`Deleted item with ID -> ${itemId} for invoice ID -> ${invoiceId}`);
};



module.exports = {
  getAllInvoices,
  saveInvoice,
  saveInvoiceItem,
  getInvoiceById,
  getInvoiceByInvoiceNumber,
  updateInvoice,
  deleteInvoiceByInvoiceNumber,
  getInvoiceItemsByInvoiceNumber,
  saveInvoiceItemsByInvoiceNumber,
  updateItemByInvoiceNumberAndInvoiceItemId,
  deleteByInvoiceIdAndItemId
};
