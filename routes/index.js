var express = require('express');
var router  = express.Router(),
    parse   = require('../helpers/parser'),
    crypto = require('crypto'),
    Booking = require('../models/booking'),
    Counter = require('../models/counters'),
    view    = require('../views/views'),
    features = require('../helpers/features'),
    validator = require('../helpers/validator'),
    globalLogins = {};

router.get('/', function(req, res, next){
  view.index(function(render){
    if(features.indexFeature() === 'page' && typeof(req.query.page) == 'undefined'){
      res.redirect('/?page=1');
    } else {
      res.send(render);
    }
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

  if(features.indexFeature() === 'page' && typeof(req.query.page) != 'undefined'){
    var skipCount = (req.query.page * 10) - 10;

    Booking.getIDsLimit(query, skipCount, function(err, record){
      var booking = parse.bookingids(req, record);

      if(!booking){
        res.sendStatus(500);
      } else {
        res.send(booking);
      }
    })
  } else {
    Booking.getIDs(query, function(err, record){
      var booking = parse.bookingids(req, record);

      if(!booking){
        res.sendStatus(500);
      } else {
        res.send(booking);
      }
    })
  }
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

router.post('/booking', function(req, res, next) {
  newBooking = req.body;

  if(req.headers['content-type'] === 'text/xml') newBooking = newBooking.booking;

  if(validator.validateAge(newBooking)){
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
  // if(globalLogins[req.cookies.token] || req.headers.authorization == 'Basic YWRtaW46cGFzc3dvcmQxMjM='){
    updatedBooking = req.body;

    if(req.headers['content-type'] === 'text/xml') updatedBooking = updatedBooking.booking;

    if(validator.validateBooking(updatedBooking) && validator.validateAge(newBooking)){
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
      });
    } else {
      res.sendStatus(400);
    }
  // } else {
  //   res.sendStatus(403);
  // }
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
