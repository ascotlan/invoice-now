const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const invoiceQueries = require('../db/queries/invoiceQueries')

// Example: Get all invoices
router.get('/', async(req, res) => {
  try {
    const userId = 1 // req.session.userId
    const invoices = await invoiceQueries.getAllInvoices(userId);
    res.json(invoices);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
