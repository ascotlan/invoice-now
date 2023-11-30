const { UserNotAuthorizedError } = require("./errorHelper");

const validateUserSession = (req, res, next) => {
  const userId = 3; //req.session.userId;
  if (!userId) {
    throw new UserNotAuthorizedError('User ID not found in session.', 401);
  }
  console.log(`User ID -> [${userId}] found in session.`);
  next();
};

module.exports = {validateUserSession};