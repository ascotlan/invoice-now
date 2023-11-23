const invoiceQueries = require('../db/queries/invoiceQueries');

const generateRandomLetter = () => String
  .fromCharCode(65 + Math.floor(Math.random() * 26));

const generateRandomNumber = () => Math
  .floor(1000 + Math.random() * 9000);

/**
 * Builds a string of 6 random alphanumeric characters (first two - letters, last 4 - digits)
 *
 * @returns {String} The generated invoice model.
 */
const generateRandomInvoiceNumber = () => {
  const letters = generateRandomLetter() + generateRandomLetter();
  const numbers = generateRandomNumber();

  return `${letters}${numbers}`;
};

/**
 * Builds an invoice model based on the provided request, converting item prices to cents.
 *
 * @param {Object} req - Http request object containing necessary information.
 * @returns {Object} The generated invoice model.
 */
const buildInvoiceModel = (req) => {
  /**
   * Adjusts the price to cents.
   *
   * @param {number} price - The price to be converted.
   * @returns {number} The price in cents.
   */
  const convertToCents = (price) => Math.round(price * 100);

  /**
   * Adjusts the items' prices to cents.
   *
   * @param {Array} items - The array of items to be adjusted.
   * @returns {Array} The array of items with prices in cents.
   */
  const adjustItemsPricesToCents = (items) => {
    return items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: convertToCents(item.price),
      total: convertToCents(item.total),
    })) || {};
  };

  return {
    invoiceNumber: req.params.id === undefined ? generateRandomInvoiceNumber() : req.params.id,
    businessUserId: req.session.userId,
    createdAt: req.body.createdAt,
    paymentDue: req.body.paymentDue,
    description: req.body.description,
    paymentTerms: req.body.paymentTerms,
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    status: req.body.status,
    businessAddress: req.body.businessAddress,
    customerAddress: req.body.customerAddress,
    items: adjustItemsPricesToCents(req.body.items),
    total: convertToCents(req.body.total)
  };
};


/**
 * Saves invoice items to the database and associates them with the provided invoice ID.
 *
 * @async
 * @param {Object} invoiceModel - The invoice model containing information about the items.
 * @throws {Error} Throws an error if there is an issue saving the items.
 * @returns {Promise<void>} A promise that resolves when the items are successfully saved.
 */
const saveInvoiceItems = async(invoiceModel) => {
  const newItems = [];

  for (const item of invoiceModel.items) {
    const { name, quantity, price, total } = item;
    
    try {
      const newItem = await invoiceQueries.saveInvoiceItem(name, quantity, price, total, invoiceModel.invoiceId);
      console.log(`Saved new item with ID -> [${newItem.id}] to the database.`);
      newItems.push(newItem);
    } catch (error) {
      console.error(`Error saving invoice item: ${error}`);
    }
  }

  invoiceModel.items = newItems;
  return invoiceModel;
};

const updateInvoice = (existingInvoice, newInvoice) => {
  const updateProperty = (obj, key, newValue) => obj[key] !== newValue && (obj[key] = newValue);

  const traverseAndCompare = (obj1, obj2) =>
    Object.entries(obj2).forEach(([key, value]) =>
      typeof value === 'object' && value !== null && obj1[key]
        ? traverseAndCompare(obj1[key], value)
        : updateProperty(obj1, key, value)
    );

  traverseAndCompare(existingInvoice, newInvoice);
  console.log(`Updated existing invoice -> ${JSON.stringify(existingInvoice)}`);
  return existingInvoice;
};

module.exports = { buildInvoiceModel, saveInvoiceItems, updateInvoice };