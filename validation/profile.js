const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.skillLevel = !isEmpty(data.skillLevel) ? data.skillLevel : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  const phoneFormat1 = new RegExp(/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/);
  const phoneFormat2 = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);
  if(data.phone !== ""){
    if(!phoneFormat1.test(data.phone) && !phoneFormat2.test(data.phone)){
      errors.phone = "Please enter a valid phone number"
  }
  }
 
  if(data.skillLevel !== ""){
    if(typeof data.skillLevel !== "number" ){
      errors.skillLevel = "Please enter a valid skill level"
    }
    if(data.skillLevel < 0 || data.skillLevel > 1000){
      errors.skillLevel = "Please enter a valid skill level"
    }
  }
  
  // if (!isEmpty(data.youtube)) {
  //   if (!Validator.isURL(data.youtube)) {
  //     errors.youtube = "Not a valid URL";
  //   }
  // }
  // if (!isEmpty(data.twitter)) {
  //   if (!Validator.isURL(data.twitter)) {
  //     errors.twitter = "Not a valid URL";
  //   }
  // }
  // if (!isEmpty(data.instagram)) {
  //   if (!Validator.isURL(data.instagram)) {
  //     errors.instagram = "Not a valid URL";
  //   }
  // }
  // if (!isEmpty(data.facebook)) {
  //   if (!Validator.isURL(data.facebook)) {
  //     errors.facebook = "Not a valid URL";
  //   }
  // }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
