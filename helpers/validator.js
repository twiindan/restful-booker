var rules    = require('../helpers/validationrules'),
    validate = require('validate.js');

exports.scrubAndValidate = function(payload, callback){
  payload.firstname = payload.firstname.trim();
  payload.lastname = payload.lastname.trim();

  callback(payload, validate(payload, rules.returnRuleSet()))
}
