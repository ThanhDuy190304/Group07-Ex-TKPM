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

function validateStudentEmail(email) {
  return email.endsWith(config.EMAIL_DOMAIN);
}

function validatePhone(phone) {
  return isValidPhoneNumber(phone);
}

function validateStatusTransition(currentStatus, newStatus) {
  return config.STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}

module.exports = {
  validateUUID,
  validateStudentData,
  validateStudentEmail,
  validatePhone,
  validateStatusTransition,
};
