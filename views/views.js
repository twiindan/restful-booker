var fs      = require('fs');
    header  = fs.readFileSync(__dirname + '/fixtures/header.html'),
    footer  = fs.readFileSync(__dirname + '/fixtures/footer.html'),
    features = require('../helpers/features')

exports.index = function(callback){
  var render = '       <div class="row">' +
               '         <div class="col-md-1" id="prev"><a href="">Prev</a></div>' +
               '         <div class="col-md-5"></div>' +
               '         <div class="col-md-5"></div>' +
               '         <div class="col-md-1" id="next"><a href="">Next</a></div>' +
               '       </div>' +
               '  <input type="hidden" id="payloadFlag" value="' + features.payloadFeature() + '" />' +
               '  <input type="hidden" id="indexFlag" value="' + features.indexFeature() + '" />';

  render += '       <div id="form" class="modal fade" role="dialog">' +
            '         <div class="modal-dialog">' +
            '           <div class="modal-content">' +
            '             <div class="modal-header">' +
            '               <button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '               <h4 class="modal-title">Create booking</h4>' +
            '             </div>' +
            '             <div class="modal-body">' +
            '                 <div class="row">' +
            '                   <div class="col-md-4">' +
            '                     <input id="firstname" class="input" placeholder="Firstname"/>' +
            '                   </div>' +
            '                   <div class="col-md-4">' +
            '                     <input id="lastname" class="input" placeholder="Lastname"/>' +
            '                   </div>' +
            '                   <div class="col-md-2">' +
            '                     <input id="totalprice" class="input"  placeholder="Price" style="width: 100%"/>' +
            '                   </div>' +
            '                   <div class="col-md-2">' +
            '                     <select id="depositpaid">' +
            '                       <option>true</option>' +
            '                       <option>false</option>' +
            '                     </select>' +
            '                   </div>' +
            '                 </div>' +
            '                 <br />' + 
            '                 <div class="row">';

  switch (features.dobFeature()) {
    case 'boolean':
        render += '              <div class="col-md-4">' +
                  '                <input id="age" class="input" type="checkbox" value="true">' +
                  '              </div>';
      break;
    case 'string':
        render += '              <div class="col-md-4">' +
                  '                <select id="age">' +
                  '                  <option value="over21">true</option>' +
                  '                  <option value="under21">false</option>' +
                  '                </select>' +
                  '              </div>';
      break;
      case 'compare':
          render += '              <div class="col-md-4">' +
                    '                <input id="age" placeholder="Age" class="datepicker input"/>' +
                    '              </div>';
        break;
  }

  render += '                <div class="col-md-4">' +
            '                  <input id="checkin" class="datepicker input" placeholder="Checkin"/>' +
            '                </div>' +
            '                <div class="col-md-4">' +
            '                  <input id="checkout" class="datepicker input" placeholder="Checkout"/>' +
            '                </div>' +
            '              </div>' +
            '            </div>' +
            '            <div class="modal-footer">' +
            '              <button type="button" class="btn btn-default" data-dismiss="modal" onclick="createBooking()">Save</button>' +
            '            </div>' +
            '          </div>' +
            '        </div>' +
            '      </div>' +
            '    </div>';

  callback(header  + render + footer);
}
