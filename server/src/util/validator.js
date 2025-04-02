const config = require("../config/validatorConfig");

const { isValidPhoneNumber } = require("libphonenumber-js");
const validator = require("validator");

function validateUUID(value) {
  return validator.isUUID(value);
}

function validateStudentData(data) {
  if (!config.VALID_STATUSES.includes(data.status)) {
    throw new Error("Invalid status");
  }
}

function validateEmail(email) {
  return email.endsWith(config.EMAIL_DOMAIN);
}

function validatePhone(phone, country) {
  return isValidPhoneNumber(phone, country);
}

function validateStatusTransition(currentStatus, newStatus) {
  return config.STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}

module.exports = {
  validateUUID,
  validateStudentData,
  validateEmail,
  validatePhone,
  validateStatusTransition,
};
