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
        presence : true,
        length : {
          minimum : 2,
          maximum : 25,
          message : "Must between at 2 and 25 characters"
        }
      },
      totalprice : {
        presence : true
      },
      depositpaid : {
        presence : true
      },
      'bookingdates.checkin' : {
        presence : true,
        equality : {
          message : 'Checkin date should before checkout',
          attribute : 'bookingdates.checkout',
          comparator : function(v1, v2){
            if(new Date(v1) < new Date(v2) && new Date(v1) >= new Date()){
              return true;
            } else {
              return false;
            }
          }
        }
      },
      "bookingdates.checkout" : {
        presence : true,
        equality : {
          message : 'Checkout date should before Dec 31st 2099',
          attribute : 'bookingdates.checkin',
          comparator : function(checkout){
            if(new Date(checkout) < new Date('2099-12-31')){
              return true;
            } else {
              return false;
            }
          }
        }
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

exports.scrubAndValidate = function(payload, callback){
  payload.firstname = payload.firstname.trim();
  payload.lastname = payload.lastname.trim();

  callback(payload, validate(payload, constraints))
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
