const { UserNotAuthorizedError } = require("./errorHelper");

const validateUserSession = (req, res, next) => {
  console.log(req.session.user_id);
  const userId = req.session.user_id;
  if (!userId) {
    throw new UserNotAuthorizedError('User ID not found in session.', 401);
  }
  console.log(`User ID -> [${userId}] found in session.`);
};

module.exports = {validateUserSession};