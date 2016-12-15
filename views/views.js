var fs      = require('fs');
    header  = fs.readFileSync(__dirname + '/fixtures/header.html'),
    footer  = fs.readFileSync(__dirname + '/fixtures/footer.html');

exports.index = function(callback){
  callback(header + '\t<input type="hidden" id="payloadFlag" value="' + process.env.payload + '" />\n' + footer);
}
