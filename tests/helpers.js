exports.generatePayload = function(firstname, lastname, totalprice, depositpaid, additionalneeds, checkin, checkout){
  var payload = {
      'firstname': firstname,
      'lastname': lastname,
      'totalprice': totalprice,
      'depositpaid': depositpaid,
      'bookingdates': {
        'checkin': checkin,
        'checkout': checkout
      }
    }

  if(typeof(additionalneeds) !== 'undefined'){
    payload.additionalneeds = additionalneeds;
  }

  return payload
}
