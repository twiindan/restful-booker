var features = require('../helpers/features');

exports.validateBooking = function(p, callback){
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
