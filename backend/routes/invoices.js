const express = require('express');
const router = express.Router();
const pool = require('../db/index');

// Example: Get all invoices
router.get('/invoices', async(req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM invoices');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
