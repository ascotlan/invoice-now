const express = require('express');
const router = express.Router();
const invoiceQueries = require('../db/queries/invoiceQueries')

// Example: Get all invoices
router.get('/', async(req, res, next) => {
  try {
    userId = req.session.userId;
    const invoices = await invoiceQueries.getAllInvoices(userId);
    res.json(invoices);
  } catch (err) {
    next(err);
  }
});

// Add/Create invoice
router.post('/', async(req, res, next) => {

  try {
    userId = req.session.userId;
    res.status(201).json(newInvoice); // 201 Created status
  }
  catch (err) {
    next(err);
  }
});


// Edit/Update invoices by id
router.post('/:id', async(req, res, next) => {
  try {
    res.send('Update an invoice')
  }
  catch (err) {
    next(err);
  }
});

// Delete an invoice
router.delete('/:id', async (req, res, next) => {
  try {
    res.send('Delete an invoice')
  }
  catch (err) {
    next(err);
  }
});

// Get all invoice items by invoice ID
router.get('/:id/items', async(req, res, next) => {
  try {
    // fetch invoices logic
    res.send('View invoice items')
  } catch (err) {
    next(err);
  }
});

// Create invoice item for invoice ID
router.post('/:id/items', async(req, res, next) => {
  try {
    // create invoice logic
    res.send('Create invoice item')
  } catch (err) {
    next(err);
  }
});

// Update invoice item by invoice ID and item ID
router.post('/:invoice_id/items/:item_id', async(req, res, next) => {
  try {
    // fetch invoice item logic
    res.send('Update invoice item by invoice id')
  } catch (err) {
    next(err);
  }
});

// Delete invoice item by invoice ID and item ID
router.delete('/:invoice_id/items/:item_id', async(req, res, next) => {
  try {
    // delete invoice item logic
    res.send('Delete an invoice item')
  } catch (err) {
    next(err);
  }
});

module.exports = router;
