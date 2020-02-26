const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  data.title = !isEmpty(data.title) ? data.title : "";

  if (!Validator.isLength(data.text, { min: 10, max: 900 })) {
    errors.text = "Your post text must be between 10 and 900 characters";
  }
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text is required";
  }
  if (!Validator.isLength(data.title, { min: 5, max: 70 })) {
    errors.title = "Your post title must be between 5 and 30 characters";
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = "A title is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
