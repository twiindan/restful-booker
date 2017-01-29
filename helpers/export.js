var parse   = require('../helpers/parser'),
    features = require('../helpers/features'),
    Booking = require('../models/booking'),
    globalLogins = {};

exports.exportBehaviour = function(req, callback){
  var featureSwitch = features.versionFeature();

  switch (true) {
    case ((featureSwitch === 'nov1' || featureSwitch === 'nov2') && (req.path === '/export/v1' || req.path === '/export/v2')):
      callback(404, null)
      break;
    case ((featureSwitch === 'yesv1' || featureSwitch === 'yesv2') && (req.path === '/export')):
      callback(404, null)
      break;
    case (featureSwitch === 'yesv1' && req.path == '/export/v2'):
      callback(404, null)
      break;
    default:
      var loggedIn = false;

      switch(features.authFeature()){
        case 'basic':
          if(req.headers.authorization === 'Basic YWRtaW46cGFzc3dvcmQxMjM='){
            loggedIn = true
          }
          break;
        case 'query':
          if(globalLogins[req.query.token]){
            delete globalLogins[req.query.token];
            loggedIn = true;
          }
          break;
        case 'token':
          if(globalLogins[req.cookies.token]){
            loggedIn = true;
          }
          break;
      }

      if(loggedIn){
        Booking.getAll(function(err, bookings){
          if(!err){
            if(features.versionFeature().indexOf('v1') !== -1){
                parse.uglifyExport(bookings, function(parsedBookings){
                  callback(200, parsedBookings)
                })
            } else {
                callback(200, bookings)
            }
          } else {
            callback(500, null);
          }
        })
      } else {
        callback(403, null);
      }
  }
},

exports.setGlobalLogin = function(key, callback){
  globalLogins[key] = true;

  callback();
}
