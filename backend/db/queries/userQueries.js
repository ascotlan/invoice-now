const { UserNotFoundError } = require("../../util/errorHelper");
const CUSTOMER_USER_TYPE = 'customer';
const pool = require("../index");

/**
 * Retrieves the user ID associated with the specified email and user type from the database.
 *
 * @async
 * @param {string} email - The email address of the user.
 * @param {string} type - The user type to filter by.
 * @throws {UserNotFoundError} Throws an error if there is an issue querying the database.
 * @returns {Promise<?string>} A promise that resolves to the user ID, or `null` if the user is not found.
 */
const getUserIdByEmailAndType = async(email, type) => {
  const { rows } = await pool.query(
    `SELECT id FROM users WHERE email = $1 AND user_type = $2;`,
    [email, type]
  );
  if (rows.length === 0) {
    throw new UserNotFoundError(`User with email -> [${email}] not found or type -> [${type}] is not matching`, 404);
  }
  return rows[0].id;
};

/**
 * Retrieves the user type associated with a given user ID.
 *
 * @param {number} id - The unique identifier of the user.
 * @returns {string|null} The user type, or null if the user is not found or an error occurs.
 * @throws {UserNotFoundError} If any error occurs during the retrieval process.
 */
const getUserTypeById = async(id) => {
  const { rows } = await pool.query(
    `SELECT user_type FROM users WHERE id = $1;`,
    [id]
  );

  if (rows.length === 0) {
    throw new UserNotFoundError(`User with ID -> [${id}] not found.`, 404);
  }

  const userType = rows[0].user_type;

  console.log(`Located user with id -> [${id}], type -> [${userType}].`);
  return userType;
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
    `SELECT 
    id as "userId",
    email as "email",
    user_type as "userType",
    picture_url as "pictureUrl",
    name as "name",
    street as "street",
    city as "city",
    password as "password",
    postal_code as "postCode",
    country as "country",
    phone_number as "phoneNumber"
    FROM users WHERE id = $1;`,
    [id]
  );
  if (rows.length === 0) {
    throw new UserNotFoundError(`User with ID -> [${id}] not found.`, 404);
  }
  console.log(`Located user for id -> [${id}].`);
  return rows[0];
};


/**
 * Saves a new user to the database.
 *
 * @async
 * @function
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} street - The street address of the user.
 * @param {string} city - The city of the user.
 * @param {string} postalCode - The postal code of the user.
 * @param {string} country - The country of the user.
 * @param {string} phoneNumber - The phone number of the user.
 * @returns {Promise<Object>} A promise that resolves to the saved user object.
 * @throws {Error} If an error occurs during the saving process.
 */
const saveUser = async(name, email, street, city, postalCode, country, phoneNumber) => {
  const { rows } = await pool.query(
    `INSERT INTO users(
      name, password, email, user_type, street, city, postal_code, country, phone_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
    [name, '12345', email, CUSTOMER_USER_TYPE, street, city, postalCode, country, phoneNumber]
  );
  console.log(`Saved user with email -> [${email} to the DB].`);
  return snakeToCamel(rows[0]);
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
    `SELECT
    id as "id",
    email as "email",
    user_type as "userType",
    picture_url as "pictureUrl",
    name as "name",
    street as "street",
    city as "city",
    password as "password",
    postal_code as "postCode",
    country as "country",
    phone_number as "phoneNumber"
    FROM users WHERE email = $1;`,
    [email]
  );
  if (rows.length === 0) {
    throw new UserNotFoundError(`User with email -> [${email}] not found.`, 404);
  }
  console.log(`Located user for email -> [${email}].`);
  return rows[0];
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
    userId: 'id',
    name: 'name',
    password: 'password',
    email: 'email',
    userType: 'user_type',
    pictureUrl: 'picture_url',
    street: 'street',
    city: 'city',
    postCode: 'postal_code',
    country: 'country',
    phoneNumber: 'phone_number'
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

  if (setClauses.length === 0) {
    // No updates needed, return the current user data
    const currentUser = await getUserById(id);
    return currentUser;
  }

  const queryText = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idParameterIndex} RETURNING *`;
  console.log(`Query text -> ${queryText}`);
  const query = {
    text: queryText,
    values
  };

  const result = await pool.query(query.text, query.values);
  console.log(`Result -> ${JSON.stringify(result.rows[0])}`);
  const updatedUser = snakeToCamel(result.rows[0]);
  console.log(`Updated user with ID -> ${JSON.stringify(updatedUser.userId)}`);
  return updatedUser;
};

const snakeToCamel = (obj) => {
  const camelObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const objectKey = key.replace(/_([a-z])/g, (match, group) => group.toUpperCase());
      let camelKey;

      if (objectKey === 'postalCode') {
        camelKey = 'postCode';
      } else if (objectKey === 'id') {
        camelKey = 'userId';
      } else {
        camelKey = objectKey;
      }

      camelObj[camelKey] = obj[key];
    }
  }
  return camelObj;
};



module.exports = {
  getUserIdByEmailAndType,
  getUserById,
  getUserByEmail,
  getUserTypeById,
  updateUserById,
  saveUser
};
