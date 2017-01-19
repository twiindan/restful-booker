var constraints;

$( document ).ready(function() {

  if($('#validationFlag').val() === 'client' || $('#validationFlag').val() === 'both'){

    constraints = {
      firstname : {
       length : {
         minimum : 2,
         maximum : 25,
         message : 'Must between at 2 and 25 characters'
       }
      },
      lastname : {
       length : {
         minimum : 2,
         maximum : 25,
         message : 'Must between at 2 and 25 characters'
       }
      },
      totalprice : {
       numericality : {
         greaterThan: 0,
         onlyInteger : true
       }
      },
      dob : {
       length : {
         minimum : 1,
       }
      },
      'bookingdates.checkin' : {
       equality : {
         message : 'Checkin date should before checkout',
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
       }
      },
      'bookingdates.checkout' : {
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
      }
      }
  } else {
   constraints = {};
  }
});

function highlightInputs(mode, message){
  if(typeof(message) === 'undefined'){
    return true;
  } else {
    if('firstname' in message){
      $('#' + mode + 'Firstname').css('border','1px solid red');

      progress = false;
    }

    if('lastname' in message){
      $('#' + mode + 'Lastname').css('border','1px solid red');

      progress = false;
    }

    if('totalprice' in message){
      $('#' + mode + 'Totalprice').css('border','1px solid red');

      progress = false;
    }

    if('bookingdates.checkin' in message){
      $('#' + mode + 'Checkin').css('border','1px solid red');

      progress = false;
    }

    if('bookingdates.checkout' in message){
      $('#' + mode + 'Checkout').css('border','1px solid red');

      progress = false;
    }

    if('dob' in message){
      $('#' + mode + 'Age').css('border','1px solid red');

      progress = false;
    }

    return false;
  }
}
