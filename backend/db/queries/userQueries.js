const { UserNotFoundError } = require("../../util/errorHelper");
const pool = require("../index");

/**
 * Retrieves the user ID associated with the specified email and user type from the database.
 *
 * @async
 * @param {string} email - The email address of the user.
 * @param {string} type - The user type to filter by.
 * @throws {Error} Throws an error if there is an issue querying the database.
 * @returns {Promise<?string>} A promise that resolves to the user ID, or `null` if the user is not found.
 */
const getUserIdByEmailAndType = async(email, type) => {
  try {
    const { rows } = await pool.query(
      `SELECT id FROM users WHERE email = $1 AND user_type = $2;`,
      [email, type]
    );
    return rows[0].id;
  } catch (error) {
    throw Error(`Error getting user ID by email: ${error}.`);
  }
};

/**
 * Retrieves the user type associated with a given user ID.
 *
 * @param {number} id - The unique identifier of the user.
 * @returns {string|null} The user type, or null if the user is not found or an error occurs.
 * @throws {Error} If any error occurs during the retrieval process.
 */
const getUserTypeById = async(id) => {
  try {
    const { rows } = await pool.query(
      `SELECT user_type FROM users WHERE id = $1;`,
      [id]
    );

    const userType = rows[0].user_type;

    console.log(`Located user with id -> [${id}], type -> [${userType}].`);
    return userType;
  } catch (error) {
    throw Error(`Error getting user type by ID: ${error}.`);
  }
};

/**
 * Retrieves user information based on the provided user ID.
 *
 * @param {number} id - The unique identifier of the user.
 * @returns {Array<Object>} An array containing the user information, or an empty array if the user is not found.
 * @throws {Error} If any error occurs during the retrieval process.
 */
const getUserById = async(id) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE id = $1;`,
    [id]
  );
  if (rows.length === 0) {
    throw new UserNotFoundError(`User with ID -> [${id}] not found.`, 404);
  }
  console.log(`Located user for id -> [${id}].`);
  return rows;
};

/**
 * Retrieves user information based on the provided email address.
 *
 * @param {string} email - The email address associated with the user.
 * @returns {Array<Object>} An array containing the user information, or an empty array if the user is not found.
 * @throws {Error} If any error occurs during the retrieval process.
 */
const getUserByEmail = async(email) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1;`,
    [email]
  );
  if (rows.length === 0) {
    throw new UserNotFoundError(`User with email -> [${email}] not found.`, 404);
  }
  console.log(`Located user for email -> [${email}].`);
  return rows;
};

/**
 * Updates user information based on the provided user ID.
 *
 * @param {number} id - The ID of the user to be updated.
 * @param {Object} user - An object containing the user information to be updated.
 * @throws {Error} If any error occurs during the update process.
 */
const updateUserById = async(id, user) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE id = $1;`,
    [id]
  );
  if (rows.length === 0) {
    throw new UserNotFoundError(`User with ID -> [${id}] not found.`, 404);
  }

  const columnsMapping = {
    name: 'name',
    password: 'password',
    email: 'email',
    userType: 'user_type',
    pictureUrl: 'picture_url',
    street: 'street',
    city: 'city',
    postalCode: 'postal_code',
    country: 'country'
  };

  const setClauses = [];
  const values = [];

  Object.entries(user).forEach(([key, value]) => {
    if (columnsMapping[key] && value !== undefined) {
      const parameterIndex = values.length + 1;
      setClauses.push(`${columnsMapping[key]} = $${parameterIndex}`);
      values.push(value);
    }
  });

  const idParameterIndex = values.length + 1;
  values.push(id);

  const queryText = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idParameterIndex} RETURNING *`;

  const query = {
    text: queryText,
    values
  };

  const result = await pool.query(query.text, query.values);
  const updatedUser = result.rows[0];
  console.log(`Updated user with ID -> ${JSON.stringify(updatedUser.id)}`);
  return updatedUser;
};


module.exports = {
  getUserIdByEmailAndType,
  getUserById,
  getUserByEmail,
  getUserTypeById,
  updateUserById
};
