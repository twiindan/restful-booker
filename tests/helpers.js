var mongoose = require('mongoose');

exports.setEnv = function(payload, dobValid, index, edit, validation, auth, callback){
  process.env['payload'] = payload;
  process.env['dob'] = dobValid;
  process.env['index'] = index;
  process.env['edit'] = edit;
  process.env['validation'] = validation;
  process.env['auth'] = auth;

  delete require.cache[require.resolve('../app')];
  var server = require('../app');

  mongoose.connection.db.dropDatabase();

  callback(server);
}

exports.generateDobObjPayload = function(firstname, lastname, totalprice, depositpaid, additionalneeds, checkin, checkout, over21){
  var payload = {
      'firstname': firstname,
      'lastname': lastname,
      'totalprice': totalprice,
      'depositpaid': depositpaid,
      'bookingdates': {
        'checkin': checkin,
        'checkout': checkout
      },
      'dob': over21
    }

  if(typeof(additionalneeds) !== 'undefined'){
    payload.additionalneeds = additionalneeds;
  }

  return payload;
}

exports.generateDobPayload = function(firstname, lastname, totalprice, depositpaid, additionalneeds, checkin, checkout, dob){
  var payload = {
      'firstname': firstname,
      'lastname': lastname,
      'totalprice': totalprice,
      'depositpaid': depositpaid,
      'bookingdates': {
        'checkin': checkin,
        'checkout': checkout
      },
      'dob': dob
    }

  if(typeof(additionalneeds) !== 'undefined'){
    payload.additionalneeds = additionalneeds;
  }

  return payload;
}
