const express = require('express');
const router = express.Router();

// Fetch all notifications by user ID
router.get('/', async (req, res, next) => {
  try {
    // get notifications logic
    res.send('All notifications')
  } catch (err) {
    next(err);
  }
});

// Create a notification for a user
router.post('/', async (req, res, next) => {
  try {
  // create a notification logic
  res.send('Create notification')
  } catch (err) {
    next(err);
  }
});

module.exports = router;