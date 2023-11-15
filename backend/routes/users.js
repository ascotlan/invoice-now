const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'The API is working and connected to the Client!' });
});

module.exports = router;