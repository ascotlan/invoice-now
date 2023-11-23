const express = require('express');
const router = express.Router();
const invoiceQueries = require('../db/queries/invoiceQueries');
const userQueries = require('../db/queries/userQueries');
const { buildInvoiceModel, saveInvoiceItems, updateInvoice } = require('../util/invoiceHelper');
const { isUserAuthorizedToManageInvoice } = require('../util/userHelper');
const { InvoiceNotFoundError } = require('../util/errorHelper');
const CUSTOMER_USER_TYPE = 'customer';

// Example: Get all invoices
router.get('/', async(req, res, next) => {
  try {
    await isUserAuthorizedToManageInvoice(req);
    const userId = req.session.userId;
    const invoices = await invoiceQueries.getAllInvoices(userId);
    res.json(invoices);
  } catch (err) {
    next(err);
  }
});

// Get invoice by invoice number
router.get('/:id', async(req, res, next) => {
  try {
    await isUserAuthorizedToManageInvoice(req);
    const invoiceNumber = req.params.id;
    invoiceQueries.getInvoiceByInvoiceNumber(invoiceNumber)
      .then((invoice) => {
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

    userQueries
      .getUserIdByEmailAndType(invoiceModel.customerEmail, CUSTOMER_USER_TYPE)
      .then((customerId) => {
        invoiceModel.customerId = customerId;
        return invoiceQueries.saveInvoice(invoiceModel);
      }).then((invoiceId) => {
        invoiceModel.invoiceId = invoiceId;
        return saveInvoiceItems(invoiceModel);
      })
      .then((invoiceModel) => {
        console.log(`Invoice and invoice items successfully saved.`);
        res.status(201).json(invoiceModel);
      }).catch((err) => {
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

    invoiceQueries.getInvoiceByInvoiceNumber(invoiceNumber)
      .then((invoice) => {
        if (!invoice) {
          throw new InvoiceNotFoundError(`Invoice with Number -> [${invoiceNumber}] not found`, 404);
        }
        const updatedInvoice = updateInvoice(invoice, invoiceModel);
        return invoiceQueries.updateInvoice(updatedInvoice);
      })
      .then((updatedInvoice) => {
        console.log(`Updated invoice with ID -> [${updatedInvoice.invoice_number}] successfully`);
        return invoiceQueries.getInvoiceByInvoiceNumber(invoiceNumber);
      })
      .then((updatedInvoice) => {
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
        res.status(200).json(`Deleted id -> ${invoiceNumber}`);
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
    isUserAuthorizedToManageInvoice(req)
      .then(() => {
        return req.params.id;
      }).then((invoiceNumber) => {
        return invoiceQueries.getInvoiceItemsByInvoiceNumber(invoiceNumber);
      }).then((invoiceItems) => {
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
        return res.status(200).json(items);
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

module.exports = router;
