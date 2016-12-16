var fs      = require('fs');
    header  = fs.readFileSync(__dirname + '/fixtures/header.html'),
    footer  = fs.readFileSync(__dirname + '/fixtures/footer.html');

exports.index = function(callback){
  var render = '       <div id="form">' +
               '          <div class="row">' +
               '            <div class="col-md-2">' +
               '              <input id="firstname" class="input" />' +
               '            </div>' +
               '            <div class="col-md-2">' +
               '              <input id="lastname" class="input"/>' +
               '            </div>' +
               '            <div class="col-md-1">' +
               '              <input id="totalprice" class="input" style="width: 100%"/>' +
               '            </div>' +
               '            <div class="col-md-1">' +
               '              <select id="depositpaid">' +
               '                <option>true</option>' +
               '                <option>false</option>' +
               '              </select>' +
               '            </div>';

  switch (process.env.dob) {
    case 'boolean':
        render += '            <div class="col-md-1">' +
                  '              <input id="age" class="input" type="checkbox" value="true">' +
                  '            </div>';
      break;
    case 'string':
        render += '            <div class="col-md-1">' +
                  '              <select id="age">' +
                  '                <option value="over21">true</option>' +
                  '                <option value="under21">false</option>' +
                  '              </select>' +
                  '            </div>';
      break;
      case 'compare':
          render += '            <div class="col-md-1">' +
                    '              <input id="age" class="datepicker input"/>' +
                    '            </div>';
        break;
  }

  render += '            <div class="col-md-2">' +
            '              <input id="checkin" class="datepicker input"/>' +
            '            </div>' +
            '            <div class="col-md-2">' +
            '              <input id="checkout" class="datepicker input"/>' +
            '            </div>' +
            '            <div class="col-md-1">' +
            '              <input type="button" value=" Save " onclick="createBooking()"/>' +
            '            </div>' +
            '          </div>' +
            '        </div>'

  render += '\t<input type="hidden" id="payloadFlag" value="' + process.env.payload + '" />\n';

  callback(header  + render + footer);
}
