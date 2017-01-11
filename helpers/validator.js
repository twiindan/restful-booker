var features = require('../helpers/features'),
    validate = require('validate.js'),
    constraints = {
      firstname : {
        presence : true,
        length : {
          minimum : 2,
          maximum : 25,
          message : "Must between at 2 and 25 characters"
        }
      },
      lastname : {
        presence : true
      },
      totalprice : {
        presence : true
      },
      depositpaid : {
        presence : true
      },
      "bookingdates.checkin" : {
        presence : true
      },
      "bookingdates.checkout" : {
        presence : true
      },
      dob : {
        equality : {
          message : "Date of birth is invalid",
          attribute : "dob",
          comparator : function(dob){
            switch (features.dobFeature()) {
              case "boolean":
                if(dob.toString() === 'true'){
                  return true;
                } else {
                  return false;
                }
                break;
              case "string":
                if(dob === 'over21'){
                  return true;
                } else {
                  return false;
                }
                break;
              case "compare":
                ageDifMs = Date.now() - new Date(dob).getTime();
                ageDate = new Date(ageDifMs);
                age = Math.abs(ageDate.getUTCFullYear() - 1970);

                if(age >= 21){
                  return true;
                } else {
                  return false;
                }
                break;
            }
          }
        }
      }
    }

exports.validateNewBooking = function(p, callback){
  callback(validate(p, constraints))
},

exports.validateEditBooking = function(p, callback){
  switch (features.editFeature()) {
    case 'full':
      if('firstname' in p && 'lastname' in p && 'totalprice' in p && 'depositpaid' in p && 'checkin' in p.bookingdates && 'checkout' in p.bookingdates){
        return true;
      } else {
        return false;
      }
      break;
    case 'partial':
      return true;
      break;
  }
},

exports.validateAge = function(booking) {
  switch (features.dobFeature()) {
    case "boolean":
      if(booking.dob.toString() === 'true'){
        return true;
      } else {
        return false;
      }
      break;
    case "string":
      if(booking.dob === 'over21'){
        return true;
      } else {
        return false;
      }
      break;
    case "compare":
      ageDifMs = Date.now() - new Date(booking.dob).getTime();
      ageDate = new Date(ageDifMs);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);

      if(age >= 21){
        return true;
      } else {
        return false;
      }
      break;
  }
}
