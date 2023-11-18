validateUserSession = (req, res, next) => {
  const userId = req?.session?.userId;
  if (!userId) {
    console.error(`User not authorized`);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log(`User with ID -> [${userId}] authorized.`)
  next();
}

module.exports = {validateUserSession};