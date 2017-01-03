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
               '  <input type="hidden" id="indexFlag" value="' + features.indexFeature() + '" />' +
               '  <input type="hidden" id="editFlag" value="' + features.editFeature() + '" />';

  render += '       <div id="form" class="modal fade" role="dialog">' +
            '         <div class="modal-dialog">' +
            '           <div class="modal-content">' +
            '             <div class="modal-header">' +
            '               <button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '               <h4 class="modal-title">Create booking</h4>' +
            '             </div>' +
            '             <div class="modal-body">';

  render += createForm('create');

  render += '            </div>' +
            '            <div class="modal-footer">' +
            '              <button type="button" class="btn btn-default" data-dismiss="modal" onclick="createBooking()">Save</button>' +
            '            </div>' +
            '          </div>' +
            '        </div>' +
            '      </div>';

  render += '  <div class="modal fade" id="editModal" role="dialog">' +
            '    <div class="modal-dialog">' +
            '      <div class="modal-content">' +
            '        <div class="modal-header">' +
            '          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '          <h4 class="modal-title" id="myModalLabel">Edit booking</h4>' +
            '        </div>' +
            '        <div class="modal-body" id="editBookingModal">' + createForm('edit') +
            '        <input type="hidden" id="editBookingId" />' +
            '        </div>' +
            '        <div class="modal-footer">' +
            '          <span id="editStatus" /></span>';

  if(features.editFeature() === 'full'){
      render += '          <button type="button" class="btn btn-default" onclick="editBooking()">Edit</button>';
  }

  render += '          <button type="button" class="btn btn-default" data-dismiss="modal" onclick="refreshPage()">Close</button>' +
            '        </div>' +
            '      </div>' +
            '    </div>' +
            '  </div>'
            '</div>';

  callback(header  + render + footer);
}

var createForm = function(type){
  var form = '                 <div class="row">' +
             '                   <div class="col-md-4">' +
             '                     <input id="' + type + 'Firstname" class="input" placeholder="Firstname"/>' +
             '                   </div>' +
             '                   <div class="col-md-4">' +
             '                     <input id="' + type + 'Lastname" class="input" placeholder="Lastname"/>' +
             '                   </div>' +
             '                   <div class="col-md-2">' +
             '                     <input id="' + type + 'Totalprice" class="input"  placeholder="Price" style="width: 100%"/>' +
             '                   </div>' +
             '                   <div class="col-md-2">' +
             '                     <select id="' + type + 'Depositpaid">' +
             '                       <option value="true">true</option>' +
             '                       <option value="false">false</option>' +
             '                     </select>' +
             '                   </div>' +
             '                 </div>' +
             '                 <br />' +
             '                 <div class="row">';

  switch (features.dobFeature()) {
    case 'boolean':
        form += '              <div class="col-md-4">' +
                '                <input id="' + type + 'Age" class="input" type="checkbox" value="true">' +
                '              </div>';
      break;
    case 'string':
        form += '              <div class="col-md-4">' +
                '                <select id="' + type + 'Age">' +
                '                  <option value="over21">true</option>' +
                '                  <option value="under21">false</option>' +
                '                </select>' +
                '             </div>';
      break;
      case 'compare':
          form += '              <div class="col-md-4">' +
                  '                <input id="' + type + 'Age" placeholder="Age" class="datepicker input"/>' +
                  '              </div>';
        break;
  }

  form += '                <div class="col-md-4">' +
          '                  <input id="' + type + 'Checkin" class="datepicker input" placeholder="Checkin"/>' +
          '                </div>' +
          '                <div class="col-md-4">' +
          '                  <input id="' + type + 'Checkout" class="datepicker input" placeholder="Checkout"/>' +
          '                </div>' +
          '              </div>';

  return form;
}
