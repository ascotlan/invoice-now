const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries/userQueries");

//Login
router.get("/login/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    userQueries
      .getUserById(userId)
      .then((user) => {
        req.session.user_id = userId;
        const authorizedUser = {
          userId: user.userId,
          userType: user.userType,
          email: user.email,
          pictureUrl: user.pictureUrl,
        };
        res.status(200).json(authorizedUser);

        // Log Set-Cookie header after response has been sent
        res.on("finish", () => {
          console.log("Set-Cookie Header:", res.get("Set-Cookie"));
        });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

//Validate user session
router.get("/validate-session", async (req, res) => {
  if (req.session && req.session.user_id) {
    try {
      const user = await userQueries.getUserById(req.session.user_id);
      if (user) {
        const authorizedUser = {
          userId: user.userId,
          userType: user.userType,
          email: user.email,
          pictureUrl: user.pictureUrl,
        };
        res.status(200).json(authorizedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

//Logout
router.post("/logout", (req, res) => {
  req.session = null;
  res.status(200).json({ message: "logged off" });
});

module.exports = router;
