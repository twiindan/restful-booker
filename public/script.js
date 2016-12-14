$( document ).ready(function() {
  populateBookings();

  $('.datepicker').datepicker({
    dateFormat: 'yy-mm-dd'
  });
});

var populateBookings = function(){
  $.get('/booking', function(data) {
      var limit = data.length - 1;
      var count = 0;

      (getBooking = function(){
        var bookingid = data[count].bookingid;

        $.get('/booking/' + bookingid, function(booking){
          $('#bookings')
            .append('<div class="row" id=' + bookingid + '><div class="col-md-2"><p>' + booking.firstname + '</p></div><div class="col-md-2"><p>' + booking.lastname + '</p></div><div class="col-md-1"><p>' + booking.totalprice + '</p></div><div class="col-md-2"><p>' + booking.depositpaid + '</p></div><div class="col-md-2"><p>' + booking.bookingdates.checkin + '</p></div><div class="col-md-2"><p>' + booking.bookingdates.checkout + '</p></div><div class="col-md-1"><input type="button" onclick="deleteBooking(' + bookingid + ')" value="Delete"/></div></div>');
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
  var booking = {
    "firstname": $('#firstname').val(),
    "lastname": $('#lastname').val(),
    "totalprice": $('#totalprice').val(),
    "depositpaid": $('#depositpaid').val(),
    "bookingdates": {
        "checkin": $('#checkin').val(),
        "checkout": $('#checkout').val()
    },
  };

  $.ajax({
    url: '/booking',
    type: 'POST',
    data: JSON.stringify(booking),
    contentType: 'application/json; charset=utf-8',
    headers: {
        accept: 'application/json'
    },
    dataType: 'json',
    success: function(data){
      console.log('Success');
      $('.input').val('');
        $('#bookings').append('<div class="row" id=' + data.bookingid + '><div class="col-md-2"><p>' + data.booking.firstname + '</p></div><div class="col-md-2"><p>' + data.booking.lastname + '</p></div><div class="col-md-1"><p>' + data.booking.totalprice + '</p></div><div class="col-md-2"><p>' + data.booking.depositpaid + '</p></div><div class="col-md-2"><p>' + data.booking.bookingdates.checkin + '</p></div><div class="col-md-2"><p>' + data.booking.bookingdates.checkout + '</p></div><div class="col-md-1"><input type="button" onclick="deleteBooking(' + data.bookingid + ')" value="Delete"/></div></div>');
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
