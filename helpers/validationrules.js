var features = require('../helpers/features');

exports.returnRuleSet = function(){
  var constraints = {
    firstname : {},
    lastname : {},
    totalprice : {},
    depositpaid : {},
    'bookingdates.checkin' : {},
    'bookingdates.checkout' : {},
    dob : {
      equality : {
        message : 'Date of birth is invalid',
        attribute : 'dob',
        comparator : function(dob){
          switch (features.dobFeature()) {
            case 'boolean':
              if(dob.toString() === 'true'){
                return true;
              } else {
                return false;
              }
              break;
            case 'string':
              if(dob === 'over21'){
                return true;
              } else {
                return false;
              }
              break;
            case 'compare':
              var currentDate = new Date();
              currentDate.setDate(currentDate.getDate() - 1)
              currentDate.setHours(0,0,0,0);

              ageDifMs = currentDate - new Date(dob).getTime();
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
  };

  if(features.validateFeature() === 'server' || features.validateFeature() === 'both'){
    constraints.firstname.length = {
        minimum : 2,
        maximum : 25,
        message : 'Must between at 2 and 25 characters'
      };

    constraints.lastname.length = {
        minimum : 2,
        maximum : 25,
        message : 'Must between at 2 and 25 characters'
      };

    constraints.totalprice.numericality = {
        greaterThan: 0,
        onlyInteger : true
      };

    constraints['bookingdates.checkin'].equality = {
        message : 'Checkin date should before checkout and not in the past',
        attribute : 'bookingdates.checkout',
        comparator : function(v1, v2){
          var currentDate = new Date();
          currentDate.setHours(0,0,0,0);

          if(new Date(v1) < new Date(v2) && new Date(v1) >= currentDate){
            return true;
          } else {
            return false;
          }
        }
      };

    constraints['bookingdates.checkout'].equality = {
        message : 'Checkout date should before Dec 31st 2099',
        attribute : 'bookingdates.checkin',
        comparator : function(checkout){
          if(new Date(checkout) < new Date('2099-12-31')){
            return true;
          } else {
            return false;
          }
        }
      };
  }

  if(features.editFeature() === 'full'){
    constraints.firstname.presence = true;
    constraints.lastname.presence = true;
    constraints.totalprice.presence = true;
    constraints.depositpaid.presence = true;
    constraints['bookingdates.checkin'].presence = true;
    constraints['bookingdates.checkout'].presence = true;
  }

  return constraints
}
