var x2js = new X2JS(),
    payloadFlag,
    indexFlag;

$( document ).ready(function() {
  payloadFlag = $('#payloadFlag').val();
  indexFlag = $('#indexFlag').val();

  if($('#editFlag').val() === 'partial'){
    $('#editModal input, #editModal select').change(function(){
      partialEditBooking($(this).val(), $(this).attr('id'), $('#editBookingId').val())
    })
  }

  currentPage = parseInt(getUrlVars()['page'])

  $('#editModal').modal({ show: false})
  $('#prev a').attr('href', '/?page=' + (currentPage - 1));
  $('#next a').attr('href', '/?page=' + (currentPage + 1));

  if(getUrlVars()['page'] === '1' || indexFlag != 'page'){
    $('#prev').css('visibility', 'hidden')
  }

  $.get('/booking/count', function(data){
    if(data.count - (currentPage * 10) <= 0){
      $('#next').css('visibility', 'hidden');
    }
  });

  $('.datepicker').datepicker({
    dateFormat: 'yy-mm-dd'
  });

  $('.editDatepicker').datepicker({
    dateFormat: 'yy-mm-dd'
  });

  $('.dobDatePicker').datepicker({
    defaultDate : -7665,
    dateFormat: 'yy-mm-dd'
  });

  populateBookings();

  $('#editModal').on('hidden.bs.modal', function () {
   location.reload();
  })

  $('#form').on('hidden.bs.modal', function () {
    location.reload();
  });

  $('input').on('click', function (){
    $(this).css('border','');
  })
});

function getUrlVars(){
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  return vars;
}

var populateBookings = function(){
  var path;

  if(indexFlag === 'page'){
    path = '/booking?page=' + getUrlVars()['page'];
  } else {
    path = '/booking';
  }

  $.get(path, function(data) {
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
          payload = $.map(form2Json(data), function(value, index){
            return [value]
          });
          limit = payload.length - 1;
          break;
      }

      (getBooking = function(){
        if(payload.length > 0){
          var bookingid = payload[count].id;

          $.get('/booking/' + bookingid, function(booking){
            if(payloadFlag === "xml") booking = x2js.xml_str2json(booking).booking;
            if(payloadFlag === "form") booking = form2Json(booking.replace(/\+/g,'%20'));

            $('#bookings')
              .append('<div class="row bookingEntry" id=' + bookingid + '><div class="col-md-2"><p>' + booking.firstname + '</p></div><div class="col-md-2"><p>' + booking.lastname + '</p></div><div class="col-md-1"><p>' + booking.totalprice + '</p></div><div class="col-md-1"><p>' + booking.depositpaid + '</p></div><div class="col-md-1"><p>' + booking.dob + '</p></div><div class="col-md-2"><p>' + booking.bookingdates.checkin + '</p></div><div class="col-md-2"><p>' + booking.bookingdates.checkout +
                      '</p></div><div class="col-md-1"><a href="#" onclick="showEditBooking(' + bookingid + ')" ><span class="glyphicon glyphicon-pencil"></span></a> <a href="#" onclick="deleteBooking(' + bookingid + ')"><span class="glyphicon glyphicon-trash"></span></a></div></div>');
          });

          if(count < limit){
            count += 1;
            getBooking();
          }
        }
      })()
  });
};

var showEditBooking = function(id){
  $('#editModal').modal({'show' : true});

  $.get('/booking/' + id, function(booking){
    if(payloadFlag === "xml") booking = x2js.xml_str2json(booking).booking;
    if(payloadFlag === "form") booking = form2Json(booking.replace(/\+/g,'%20'));

    $('#editBookingId').val(id);
    $('#editFirstname').val(booking.firstname);
    $('#editLastname').val(booking.lastname);
    $('#editTotalprice').val(booking.totalprice);
    $('#editDepositpaid option[value=' + booking.depositpaid + ']').attr('selected', true);

    var dobField = $('#editAge');

    switch (dobField.attr('type')) {
      case 'checkbox':
        dobField.attr("checked", booking.dob);
        break;
      default:
        dobField.val(booking.dob);
        break;
    }

    $('#editCheckin').val(booking.bookingdates.checkin);
    $('#editCheckout').val(booking.bookingdates.checkout);
  });
}
