const userQueries = require('../db/queries/userQueries');
const { UserNotAuthorizedError } = require('../util/errorHelper');
const BUSINESS_USER_TYPE = 'business';

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
    postCode: req.body.customerAddress.postCode,
    country: req.body.customerAddress.country,
    name: req.body.customerName,
    email: req.body.customerEmail
  };
};

const buildBusinessModel = (req) => {
  return {
    street: req.body.businessAddress.street,
    city: req.body.businessAddress.city,
    postCode: req.body.businessAddress.postCode,
    country: req.body.businessAddress.country
  };
};

module.exports = { isUserAuthorizedToManageInvoice, buildCustomerModel, buildBusinessModel };