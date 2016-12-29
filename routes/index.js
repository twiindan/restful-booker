var express = require('express');
var router  = express.Router(),
    parse   = require('../helpers/parser'),
    crypto = require('crypto'),
    Booking = require('../models/booking'),
    Counter = require('../models/counters'),
    view    = require('../views/views'),
    features = require('../helpers/features'),
    globalLogins = {};

router.get('/', function(req, res, next){
  view.index(function(render){
    res.send(render);
  });
});

router.get('/ping', function(req, res, next) {
  res.sendStatus(201);
});

router.get('/booking', function(req, res, next) {
  var query = {};

  if(typeof(req.query.firstname) != 'undefined'){
    query.firstname = req.query.firstname
  }

  if(typeof(req.query.lastname) != 'undefined'){
    query.lastname = req.query.lastname
  }

  if(typeof(req.query.checkin) != 'undefined'){
    query["bookingdates.checkin"] = {$gt: new Date(req.query.checkin).toISOString()}
  }

  if(typeof(req.query.checkout) != 'undefined'){
    query["bookingdates.checkout"] = {$lt: new Date(req.query.checkout).toISOString()}
  }

  Booking.getIDs(query, function(err, record){
    var booking = parse.bookingids(req, record);

    if(!booking){
      res.sendStatus(500);
    } else {
      res.send(booking);
    }
  })
});

router.get('/booking/:id',function(req, res, next){
  Booking.get(req.params.id, function(err, record){
    if(record){
      var booking = parse.booking(req.headers.accept, record);

      if(!booking){
        res.sendStatus(500);
      } else {
        res.send(booking);
      }
    } else {
      res.sendStatus(404)
    }
  })
});

var validateAge = function(booking) {
  switch (features.dobFeature()) {
    case "boolean":
      if(newBooking.dob.toString() === 'true'){
        return true;
      } else {
        return false;
      }
      break;
    case "string":
      if(newBooking.dob === 'over21'){
        return true;
      } else {
        return false;
      }
      break;
    case "compare":
      ageDifMs = Date.now() - new Date(newBooking.dob).getTime();
      ageDate = new Date(ageDifMs);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);

      if(age >= 21){
        return true;
      } else {
        return false;
      }
      break;
  }
}

router.post('/booking', function(req, res, next) {
  newBooking = req.body;

  if(req.headers['content-type'] === 'text/xml') newBooking = newBooking.booking;

  if(validateAge(newBooking)){
    Booking.create(newBooking, function(err, booking){
      if(err)
        res.sendStatus(500);
      else {
        var record = parse.bookingWithId(req, booking);

        if(!record){
          res.sendStatus(500);
        } else {
          res.send(record);
        }
      }
    })
  } else {
    res.sendStatus(400);
  }
});

router.put('/booking/:id', function(req, res, next) {
  if(globalLogins[req.cookies.token] || req.headers.authorization == 'Basic YWRtaW46cGFzc3dvcmQxMjM='){
    updatedBooking = req.body;

    if(req.headers['content-type'] === 'text/xml') updatedBooking = updatedBooking.booking;

    Booking.update(req.params.id, updatedBooking, function(err){
      Booking.get(req.params.id, function(err, record){
        if(record){
          var booking = parse.booking(req.headers.accept, record);

          if(!booking){
            res.sendStatus(500);
          } else {
            res.send(booking);
          }
        } else {
          res.sendStatus(405);
        }
      })
    })
  } else {
    res.sendStatus(403);
  }
});

router.delete('/booking/:id', function(req, res, next) {
  if(globalLogins[req.cookies.token] || req.headers.authorization == 'Basic YWRtaW46cGFzc3dvcmQxMjM='){
    Booking.get(req.params.id, function(err, record){
      if(record){
        Booking.delete(req.params.id, function(err){
            res.sendStatus(201);
        });
      } else {
        res.sendStatus(405);
      }
    });
  } else {
    res.sendStatus(403);
  }
});

router.post('/auth', function(req, res, next){
  credentials = req.body;

  if(req.headers['content-type'] === 'text/xml') credentials = credentials.auth;

  if(credentials.username === "admin" && credentials.password === "password123"){
    var token = crypto.randomBytes(Math.ceil(15/2))
                    .toString('hex')
                    .slice(0,15);

    globalLogins[token] = true;

    res.send(parse.token(token));
  } else {
    res.send({'reason': 'Bad credentials'});
  }
})

module.exports = router;
