const express = require('express');
const router = express.Router();
const invoiceQueries = require('../db/queries/invoiceQueries');
const { buildInvoiceModel, saveInvoiceItems, updateInvoice, convertInvoiceItemsPriceToDollars, convertCents } = require('../util/invoiceHelper');
const { isUserAuthorizedToManageInvoice, processCustomerData, processBusinessData } = require('../util/userHelper');
const { InvoiceNotFoundError } = require('../util/errorHelper');

// Example: Get all invoices
router.get('/', async(req, res, next) => {
  try {
    const userId = req.session.user_id;
    const invoices = await invoiceQueries.getAllInvoices(userId);
    invoices.forEach(invoice => {
      invoice.items = convertInvoiceItemsPriceToDollars(invoice.items);
      invoice.total = convertCents(invoice.total);
    });
    res.json(invoices);
  } catch (err) {
    next(err);
  }
});

// Get invoice by invoice number
router.get('/:id', async(req, res, next) => {
  try {
    const invoiceNumber = req.params.id;
    invoiceQueries.getInvoiceByInvoiceNumber(invoiceNumber)
      .then((invoice) => {
        invoice.items = convertInvoiceItemsPriceToDollars(invoice.items);
        invoice.total = convertCents(invoice.total);
        res.status(200).json(invoice);
      }).catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

// Add/Create invoice
router.post('/', async(req, res, next) => {
  try {
    await isUserAuthorizedToManageInvoice(req);
    const invoiceModel = buildInvoiceModel(req);

    processBusinessData(req)
      .then((business) => {
        invoiceModel.businessAddress = {
          street: business.street,
          city: business.city,
          postCode: business.postCode,
          country: business.country,
          phoneNumber: business.phoneNumber
        };
        return processCustomerData(req);
      })
      .then((customer) => {
        invoiceModel.customerId = customer.id || customer.userId;
        invoiceModel.customerAddress = {
          street: customer.street,
          city: customer.city,
          postCode: customer.postCode,
          country: customer.country,
          phoneNumber: customer.phoneNumber
        };
        return invoiceQueries.saveInvoice(invoiceModel);
      })
      .then((invoiceId) => {
        invoiceModel.invoiceId = invoiceId;
        return saveInvoiceItems(invoiceModel);
      })
      .then((invoiceModel) => {
        console.log(`Invoice and invoice items successfully saved.`);
        invoiceModel.items = convertInvoiceItemsPriceToDollars(invoiceModel.items);
        invoiceModel.total = convertCents(invoiceModel.total);
        res.status(201).json(invoiceModel);
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    console.log(`Error occurred -> [${err.message}]`);
    next(err);
  }
});


// Edit/Update invoices by id
router.post('/:id', async(req, res, next) => {
  try {
    await isUserAuthorizedToManageInvoice(req);
    const invoiceNumber = req.params.id;
    const invoiceModel = buildInvoiceModel(req);
    await processBusinessData(req)
      .then((business) => {
        invoiceModel.businessAddress = {
          street: business.street,
          city: business.city,
          postCode: business.postCode,
          country: business.country,
          phoneNumber: business.phoneNumber
        };
      });
    invoiceQueries.getInvoiceByInvoiceNumber(invoiceNumber)
      .then((invoice) => {
        if (!invoice) {
          throw new InvoiceNotFoundError(`Invoice with Number -> [${invoiceNumber}] not found`, 404);
        }
        const updatedInvoice = updateInvoice(invoice, invoiceModel);
        return invoiceQueries.updateInvoice(updatedInvoice);
      })
      .then((updatedInvoice) => {
        console.log(`Updated invoice with Number -> [${updatedInvoice.invoice_number}] successfully`);
        return invoiceQueries.getInvoiceByInvoiceNumber(invoiceNumber);
      })
      .then((updatedInvoice) => {
        updatedInvoice.items = convertInvoiceItemsPriceToDollars(updatedInvoice.items);
        updatedInvoice.total = convertCents(updatedInvoice.total);
        res.status(200).json(updatedInvoice);
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

// Delete an invoice
router.post('/:id/delete', (req, res, next) => {
  let invoiceNumber;
  try {
    isUserAuthorizedToManageInvoice(req)
      .then(() => {
        invoiceNumber = req.params.id;

        console.log(`Invoice number -> ${invoiceNumber}`);
        return invoiceQueries.getInvoiceByInvoiceNumber(invoiceNumber);
      })
      .then((invoice) => {
        if (!invoice) {
          throw new InvoiceNotFoundError(`Invoice with Number -> [${invoiceNumber}] not found`, 404);
        }
        console.log(`Invoice -> ${JSON.stringify(invoice)}`);
        return invoiceQueries.deleteInvoiceByInvoiceNumber(invoice.invoiceNumber);
      })
      .then(() => {
        res.status(200).json(`Deleted invoice number -> ${invoiceNumber}`);
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});


// Get all invoice items by invoice ID
router.get('/:id/items', async(req, res, next) => {
  try {
    const invoiceNumber = req.params.id;
    invoiceQueries.getInvoiceItemsByInvoiceNumber(invoiceNumber)
      .then((invoiceItems) => {
        invoiceItems = convertInvoiceItemsPriceToDollars(invoiceItems);
        res.status(200).json(invoiceItems);
      }).catch((error) => {
        next(error);
      });
  } catch (err) {
    next(err);
  }
});

// Create invoice item for invoice ID
router.post('/:id/items', async(req, res, next) => {
  try {
    const items = req.body.items;
    isUserAuthorizedToManageInvoice(req)
      .then(() => {
        return req.params.id;
      }).then((invoiceNumber) => {
        return invoiceQueries.saveInvoiceItemsByInvoiceNumber(invoiceNumber, items);
      }).then((items) => {
        items = convertInvoiceItemsPriceToDollars(items);
        return res.status(200).json(items);
      }).catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

// Update invoice item by invoice ID and item ID
router.post('/:invoice_id/items/:item_id', async(req, res, next) => {
  try {
    const item = req.body.item;
    const invoiceNumber = req.params.invoice_id;
    const itemId = req.params.item_id;
    isUserAuthorizedToManageInvoice(req)
      .then(() => {
        return invoiceQueries.updateItemByInvoiceNumberAndInvoiceItemId(invoiceNumber, itemId, item);
      }).then((updatedItem) => {
        updatedItem.price = convertCents(updatedItem.price);
        return res.status(200).json(updatedItem);
      }).catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

// Delete invoice item by invoice ID and item ID
router.post('/:invoice_id/items/:item_id/delete', async(req, res, next) => {
  try {
    const invoiceNumber = req.params.invoice_id;
    const itemId = req.params.item_id;
    isUserAuthorizedToManageInvoice(req)
      .then(() => {
        return invoiceQueries.deleteByInvoiceIdAndItemId(invoiceNumber, itemId);
      }).then(() => {
        res.status(200).json(`Deleted item id -> ${itemId}`);
      }).catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/status', async(req, res, next) => {
  const invoiceNumber = req.params.id;
  const statusToUpdate = req.body.status;
  try {
    isUserAuthorizedToManageInvoice(req)
      .then(() => {
        return invoiceQueries.updateInvoiceStatusByInvoiceNumber(invoiceNumber, statusToUpdate);
      }).then((status) => {
        res.status(200).json({ invoiceNumber: `${invoiceNumber}`, status: `${status}` });
      }).catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
});


router.get('/:id/status', async(req, res, next) => {
  const invoiceNumber = req.params.id;
  try {
    invoiceQueries.getInvoiceStatusByInvoiceNumber(invoiceNumber)
      .then((status) => {
        res.status(200).json({ invoiceNumber: `${invoiceNumber}`, status: `${status}` });
      }).catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
