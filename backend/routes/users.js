const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'The API is working and connected to the Client!' });
});

// Read user by id
router.get('/:id', async (req, res, next) => {
  try {
    
    res.send('Read user by id');

  } catch (err) {
    next(err);
  }
});

// Update user profile
router.post('/:id', async(req, res, next) => {
  try {
      
    res.send('Update user profile');
  
  } catch (err) {
    next(err);
  }
});

module.exports = router;