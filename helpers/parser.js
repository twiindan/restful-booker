var js2xmlparser = require("js2xmlparser"),
    dateFormat = require('dateformat'),
    formurlencoded = require('form-urlencoded'),
    features = require('./features');

exports.bookingids = function(req, rawBooking){
  var payload = [];

  rawBooking.forEach(function(b){
    var tmpBooking = {
      id: b.bookingid,
    }

    payload.push(tmpBooking);
  });

  switch (features.payloadFeature()) {
    case 'json':
      return payload;
      break;
    case 'xml':
      return js2xmlparser('bookings', {'booking': payload});
      break;
  }
}

exports.booking = function(accept, rawBooking){
	var booking = {
    'firstname' : rawBooking.firstname,
    'lastname' : rawBooking.lastname,
    'totalprice' : rawBooking.totalprice,
    'depositpaid' : rawBooking.depositpaid,
    'bookingdates' : {
      'checkin' : dateFormat(rawBooking.bookingdates.checkin, "yyyy-mm-dd"),
      'checkout' : dateFormat(rawBooking.bookingdates.checkout, "yyyy-mm-dd")
    }
  }

  if(typeof(rawBooking.dob) !== 'undefined'){
    booking.dob = rawBooking.dob;
  }

  if(typeof(rawBooking.additionalneeds) !== 'undefined'){
    booking.additionalneeds = rawBooking.additionalneeds;
  }

  switch(process.env.payload){
    case 'xml':
      return js2xmlparser('booking', booking);
      break;
    case 'json':
      return booking;
      break;
    case 'form':
      return formurlencoded(booking);
      break;
    default:
      return null;
  }
}

exports.bookingWithId = function(req, rawBooking){
  var booking = {
    'firstname' : rawBooking.firstname,
    'lastname' : rawBooking.lastname,
    'totalprice' : rawBooking.totalprice,
    'depositpaid' : rawBooking.depositpaid,
    'bookingdates' : {
      'checkin' : dateFormat(rawBooking.bookingdates.checkin, "yyyy-mm-dd"),
      'checkout' : dateFormat(rawBooking.bookingdates.checkout, "yyyy-mm-dd")
    }
  }

  if(typeof(rawBooking.dob) !== 'undefined'){
    booking.dob = rawBooking.dob;
  }

  if(typeof(rawBooking.additionalneeds) !== 'undefined'){
    booking.additionalneeds = rawBooking.additionalneeds;
  }

  var payload = {
    "bookingid" : rawBooking.bookingid,
    "booking" : booking
  }

  switch(process.env.payload){
    case 'xml':
      return js2xmlparser('created-booking', payload);
      break;
    case 'json':
      return payload;
      break;
    case 'form':
      return formurlencoded(payload);
      break;
    default:
      return null;
  }
}

exports.token = function(token, callback){
  switch (process.env.payload) {
    case 'xml':
      return '<token>' + token + '</token>';
      break;
    case 'json':
      return {'token': token};
      break;
    case 'form':
      return token;
      break;
  }
}
