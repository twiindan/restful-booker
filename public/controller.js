var payloadFlag;

$( document ).ready(function() {
  payloadFlag = $('#payloadFlag').val();
});

var makeRequest = function(url, verb, payload, type, callback){
  var requestDetails = {};

  if(payloadFlag == "json"){
    requestDetails.contentType = "application/json";
    requestDetails.payload = JSON.stringify(payload);
  } else if(payloadFlag == "xml"){
    requestDetails.contentType = "text/xml";
    requestDetails.payload = '<booking>' + x2js.json2xml_str(payload) + '</booking>';
  } else if(payloadFlag == "form"){
    requestDetails.contentType = "application/x-www-form-urlencoded";
    requestDetails.payload = $.param(payload);
  }

  $.ajax({
    url: url,
    type: verb,
    data: requestDetails.payload,
    contentType: requestDetails.contentType,
    success: function(data){
      callback(data);
    },
    statusCode: {
      400: function(data) {
        highlightInputs(type, JSON.parse(data.responseText));
      }
    }
  });
}

var createBooking = function(){
  var booking = {
        "firstname": $('#createFirstname').val(),
        "lastname": $('#createLastname').val(),
        "totalprice": $('#createTotalprice').val(),
        "depositpaid": $('#createDepositpaid').val(),
        "bookingdates": {
            "checkin": $('#createCheckin').val(),
            "checkout": $('#createCheckout').val()
        },
      };

  if($('#createAge').is(':checkbox')){
    booking.dob = $('#createAge').prop('checked');
  } else {
    booking.dob = $('#createAge').val();
  }

  var message = validate(booking, constraints);

  if(highlightInputs('create', message)){
    makeRequest('/booking', 'POST', booking, 'create', function(data){
      $('#form').modal('toggle');
    })
  }
}

var editBooking = function(){
  var booking = {
        "firstname": $('#editFirstname').val(),
        "lastname": $('#editLastname').val(),
        "totalprice": $('#editTotalprice').val(),
        "depositpaid": $('#editDepositpaid').val(),
        "bookingdates": {
            "checkin": $('#editCheckin').val(),
            "checkout": $('#editCheckout').val()
        },
      },
      bookingId = $('#editBookingId').val();

  if($('#editAge').is(':checkbox')){
    booking.dob = $('#editAge').prop('checked');
  } else {
    booking.dob = $('#editAge').val();
  }

  var message = validate(booking, constraints);

  if(highlightInputs('edit', message)){
    makeRequest('/booking/' + bookingId, 'PUT', booking, 'edit', function(data){
      $('#editModal').modal('toggle');
    });
  }
};

var partialEditBooking = function(value, item, bookingId){
  var editPayload = {};

  if($('#editAge').is(':checkbox')){
    editPayload.dob = $('#editAge').prop('checked');
  } else {
    editPayload.dob = $('#editAge').val();
  }

  var itemName = item.replace('edit','').toLowerCase();

  if(itemName == 'checkin' || itemName == 'checkout'){
      editPayload['bookingdates'] = {
          'checkin': $('#editCheckin').val(),
          'checkout': $('#editCheckout').val()
      }
  } else if(itemName !== 'age'){
      editPayload[itemName] = value;
  }

  var message = validate(editPayload, constraints);

  if(highlightInputs('edit', message)){
    makeRequest('/booking/' + bookingId, 'PATCH', editPayload, 'edit', function(data){
      $('#editStatus').text('Booking updated');
    });
  }
};

var deleteBooking = function(id){
  $.ajax({
    url: '/booking/' + id,
    type: 'DELETE',
    success: function(data){
      location.reload();
    }
  })
};
