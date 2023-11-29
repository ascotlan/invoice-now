const userQueries = require('../db/queries/userQueries');
const { UserNotAuthorizedError, UserNotFoundError } = require('../util/errorHelper');
const BUSINESS_USER_TYPE = 'business';
const CUSTOMER_USER_TYPE = 'customer';

/**
 * Checks if the user with the specified ID has a business user type.
 *
 * @async
 * @param {string} userId - The ID of the user to check.
 * @throws {Error} Throws an error if there is an issue retrieving the user type.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the user has a business user type, otherwise `false`.
 */
const isUserTypeBusiness = async(userId) => {
  const userType = await userQueries.getUserTypeById(userId);
  return userType === BUSINESS_USER_TYPE;
};

/**
 * Validates the user's authority to create an invoice.
 *
 * @async
 * @param {Object} req - Http request object containing user information.
 * @throws {UserNotAuthorizedError} Throws an error if the user is not authorized.
 * @returns {Promise<void>} A promise that resolves if the user is authorized.
 */
const isUserAuthorizedToManageInvoice = async(req) => {
  // check user authority
  const userId = req.session.userId;
  // check if userAuthorized
  const isUserAuthorized = await isUserTypeBusiness(userId);
  
  if (!isUserAuthorized) {
    throw new UserNotAuthorizedError(`User with id -> ${userId} is not authorized to manage invoice.`, 401);
  }
};

/**
 * Builds an invoice model based on the provided request, converting item prices to cents.
 *
 * @param {Object} req - Http request object containing necessary information.
 * @returns {Object} The generated invoice model.
 */
const buildCustomerModel = (req) => {
  return {
    street: req.body.customerAddress.street,
    city: req.body.customerAddress.city,
    postalCode: req.body.customerAddress.postalCode,
    country: req.body.customerAddress.country,
    name: req.body.customerName,
    email: req.body.customerEmail,
    phoneNumber: req.body.customerAddress.phoneNumber
  };
};

const buildBusinessModel = (req) => {
  return {
    street: req.body.businessAddress.street,
    city: req.body.businessAddress.city,
    postalCode: req.body.businessAddress.postalCode,
    country: req.body.businessAddress.country,
    phoneNumber: req.body.businessAddress.phoneNumber
  };
};

const buildUserModel = (req) => {
  return {
    name: req.body.name === undefined ? undefined : req.body.name,
    password: req.body.password === undefined ? undefined : req.body.password,
    email: req.body.email === undefined ? undefined : req.body.email,
    userType: req.body.userType === undefined ? undefined : req.body.userType,
    pictureUrl: req.body.pictureUrl === undefined ? undefined : req.body.pictureUrl,
    street: req.body.street === undefined ? undefined : req.body.street,
    city: req.body.city === undefined ? undefined : req.body.city,
    postalCode: req.body.postalCode === undefined ? undefined : req.body.postalCode,
    country: req.body.country === undefined ? undefined : req.body.country,
    phoneNumber: req.body.phoneNumber === undefined ? undefined : req.body.phoneNumber
  };
};


/**
 * Processes customer data, updates the user information, and handles UserNotFoundError.
 *
 * @async
 * @function
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} A promise that resolves to the updated user object.
 * @throws {UserNotFoundError} If the user with the provided email is not found.
 * @throws {Error} If an error occurs during processing or saving.
 */
const processCustomerData = async(req) => {
  const customer = buildCustomerModel(req);
  try {
    return await userQueries.getUserByEmail(customer.email);
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      const { name, email, street, city, postalCode, country, phoneNumber } = customer;
      const newUser = await userQueries.saveUser(name, email, street, city, postalCode, country, phoneNumber);
      console.log(`Saved new user to the DB -> [${JSON.stringify(newUser)}]`);
        
      return newUser;
    } else {
      throw err;
    }
  }
};


/**
 * Processes business data and updates the user information.
 *
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} A promise that resolves to the updated user object.
 * @throws {Error} If an error occurs during processing.
 */
const processBusinessData = async(req) => {
  const business = buildBusinessModel(req);
    
  const user = await userQueries.getUserById(req.session.userId);

  const updatedUser = await userQueries.updateUserById(user.id, business);
  console.log(`Updated business user data = [${JSON.stringify(updatedUser)}]`);

  return updatedUser;
};

module.exports = {
  isUserAuthorizedToManageInvoice,
  buildCustomerModel,
  buildBusinessModel,
  buildUserModel,
  CUSTOMER_USER_TYPE,
  BUSINESS_USER_TYPE,
  processCustomerData,
  processBusinessData
};