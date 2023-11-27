const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/userQueries');
const { buildUserModel } = require('../util/userHelper');

router.get('/', (req, res) => {
  res.json({ message: 'The API is working and connected to the Client!' });
});

// Read user by id
router.get('/:id', async(req, res, next) => {
  try {
    const userId = req.params.id;
    userQueries.getUserById(userId)
      .then((user) => {
        res.status(200).json(user);
      }).catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

// Update user profile
router.post('/:id', async(req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = buildUserModel(req);
    userQueries.updateUserById(userId, userData)
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      }).catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

module.exports = router;