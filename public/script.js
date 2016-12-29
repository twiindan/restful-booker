var x2js = new X2JS(),
    payloadFlag;

$( document ).ready(function() {
  populateBookings();

  $('.datepicker').datepicker({
    dateFormat: 'yy-mm-dd'
  });

  payloadFlag = $('#payloadFlag').val();
});

var populateBookings = function(){
  $.get('/booking', function(data) {
      var payload,
          limit,
          count = 0;

      switch (payloadFlag) {
        case 'json':
          payload = data;
          limit = payload.length - 1;
          break;
        case 'xml':
          payload = x2js.xml_str2json(data)['bookings']['booking'];
          limit = payload.length - 1;
          break;
        case 'form':
          payload = form2Json(data);
          limit = Object.keys(payload).length - 1;
          break;
      }

      (getBooking = function(){
        var bookingid = payload[count].id;

        $.get('/booking/' + bookingid, function(booking){
          if(payloadFlag === "xml") booking = x2js.xml_str2json(booking).booking;
          if(payloadFlag === "form") booking = form2Json(booking);

          $('#bookings')
            .append('<div class="row" id=' + bookingid + '><div class="col-md-2"><p>' + booking.firstname + '</p></div><div class="col-md-2"><p>' + booking.lastname + '</p></div><div class="col-md-1"><p>' + booking.totalprice + '</p></div><div class="col-md-1"><p>' + booking.depositpaid + '</p></div><div class="col-md-1"><p>' + booking.dob + '</p></div><div class="col-md-2"><p>' + booking.bookingdates.checkin + '</p></div><div class="col-md-2"><p>' + booking.bookingdates.checkout + '</p></div><div class="col-md-1"><input type="button" onclick="deleteBooking(' + bookingid + ')" value="Delete"/></div></div>');
        });

        if(count < limit){
          count += 1;
          getBooking();
        }
      })()
  });
};

var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var createBooking = function(){
  var requestDetails = {},
      booking = {
        "firstname": $('#firstname').val(),
        "lastname": $('#lastname').val(),
        "totalprice": $('#totalprice').val(),
        "depositpaid": $('#depositpaid').val(),
        "dob": $('#age').val(),
        "bookingdates": {
            "checkin": $('#checkin').val(),
            "checkout": $('#checkout').val()
        },
      };

  if(payloadFlag == "json"){
    requestDetails.contentType = "application/json";
    requestDetails.payload = JSON.stringify(booking);
  } else if(payloadFlag == "xml"){
    requestDetails.contentType = "text/xml";
    requestDetails.payload = '<booking>' + x2js.json2xml_str(booking) + '</booking>';
  } else if(payloadFlag == "form"){
    requestDetails.contentType = "application/x-www-form-urlencoded";
    requestDetails.payload = $.param(booking);
  }

  $.ajax({
    url: '/booking',
    type: 'POST',
    data: requestDetails.payload,
    contentType: requestDetails.contentType,
    success: function(data){
      if(payloadFlag === "xml") data = x2js.xml_str2json(data)['created-booking'];
      if(payloadFlag === "form") data = form2Json(data);

      $('.input').val('');
        $('#bookings')
          .append('<div class="row" id=' + data.bookingid + '><div class="col-md-2"><p>' + data.booking.firstname + '</p></div><div class="col-md-2"><p>' + data.booking.lastname + '</p></div><div class="col-md-1"><p>' + data.booking.totalprice + '</p></div><div class="col-md-1"><p>' + data.booking.depositpaid + '</p></div><div class="col-md-1"><p>' + data.booking.dob + '</p></div><div class="col-md-2"><p>' + data.booking.bookingdates.checkin + '</p></div><div class="col-md-2"><p>' + data.booking.bookingdates.checkout + '</p></div><div class="col-md-1"><input type="button" onclick="deleteBooking(' + data.bookingid + ')" value="Delete"/></div></div>');
    },
    statusCode: {
      400: function() {
        alert( "Person is too young to book" );
      }
    }
  })
}

var deleteBooking = function(id){
  $.ajax({
    url: '/booking/' + id,
    type: 'DELETE',
    headers: {
        authorization: 'Basic YWRtaW46cGFzc3dvcmQxMjM='
    },
    success: function(data){
      $('#' + id).remove();
    }
  })
}
