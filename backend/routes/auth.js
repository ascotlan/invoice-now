const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/userQueries');

router.get('/login/:id', async(req, res, next) => {
  try {
    const userId = req.params.id;
    userQueries.getUserById(userId)
      .then((user) => {
        req.session.user_id = userId;
        const authorizedUser = {
          userId: user.userId,
          userType: user.userType,
          email: user.email,
          pictureUrl: user.pictureUrl
        }
        res.status(200).json(authorizedUser);
      }).catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  req.session = null;
  res.status(200).json({"message": "logged off"})
});

module.exports = router;