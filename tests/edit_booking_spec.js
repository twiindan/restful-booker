var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    helpers      = require('./helpers'),
    js2xmlparser = require("js2xmlparser"),
    xml2js       = require('xml2js').parseString,
    formurlencoded = require('form-urlencoded');

var payload  = helpers.generateDobPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21'),
    payload2 = helpers.generateDobPayload('Geoff', 'White', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');
    partialPayload = {
      'firstname': 'Geoff',
      'lastname': 'White',
      'dob': 'over21',
      'bookingdates': {
        'checkin': '2080-01-01',
        'checkout': '2080-01-02'
      }
    }

parseBooleans = function(str) {
  if (/^(?:true|false)$/i.test(str)) {
    str = str.toLowerCase() === 'true';
  }
  return str;
};

parseNumbers = function(str) {
  if (!isNaN(str)) {
    str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
  }
  return str;
};

describe('restful-booker - Edit feature switch', function () {

  it('responds with a 200 and updated payload using JSON full record edit feature switch on PUT /booking', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'nov1', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(res){
          request(server)
            .put('/booking/1')
            .set('Accept', 'application/json')
            .send(payload2)
            .expect(200)
            .expect(payload2, done);
        })
    });
  });

  it('responds with a 200 and updated payload using XML full record edit feature switch on PUT /booking', function(done){
    helpers.setEnv('xml', 'string', 'full', 'full', 'server', 'basic', 'nov1', function(server){
      xmlPayload = js2xmlparser('booking', payload);
      xmlPayload2 = js2xmlparser('booking', payload2);

      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(xmlPayload)
        .then(function(res){
          return xml2js(res.text, {explicitArray: false, valueProcessors: [parseNumbers, parseBooleans]}, function (err, result) {
            request(server)
              .put('/booking/' + result['created-booking'].bookingid)
              .set('Content-type', 'text/xml')
              .send(xmlPayload2)
              .expect(200)
              .expect(xmlPayload2, done);
          });
        });
    });
  });

  it('responds with a 200 and updated payload using URL encoded full record edit feature switch on PUT /booking', function(done){
    helpers.setEnv('form', 'string', 'full', 'full', 'server', 'basic', 'nov1', function(server){
      var token;


      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payload))
        .then(function(res){
          request(server)
            .put('/booking/' + res.text.match(/[0-9]/)[0])
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(formurlencoded(payload2))
            .expect(200)
            .expect(formurlencoded(payload2), done);
        })
    });
  });

  it('responds with a 400 when sending a partial payload in full edit mode', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'nov1', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(res){
          request(server)
            .put('/booking/1')
            .set('Accept', 'application/json')
            .send(partialPayload)
            .expect(400, done);
        })
    });
  });

  it('responds with a JSON partial record edit feature switch on PATCH /booking', function(done){
    helpers.setEnv('json', 'string', 'full', 'partial', 'server', 'basic', 'nov1', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(res){
          request(server)
            .patch('/booking/1')
            .set('Accept', 'application/json')
            .send(partialPayload)
            .expect(200)
            .expect(payload2, done);
        })
    });
  });

  it('responds with a XML partial record edit feature switch on PATCH /booking', function(done){
    helpers.setEnv('xml', 'string', 'full', 'partial', 'server', 'basic', 'nov1', function(server){
      xmlPayload = js2xmlparser('booking', payload);
      xmlPayload2 = js2xmlparser('booking', payload2);
      xmlPartialPayload = js2xmlparser('booking', partialPayload);

      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(xmlPayload)
        .then(function(res){
          return xml2js(res.text, {explicitArray: false, valueProcessors: [parseNumbers, parseBooleans]}, function (err, result) {
            request(server)
              .patch('/booking/' + result['created-booking'].bookingid)
              .set('Content-type', 'text/xml')
              .send(xmlPartialPayload)
              .expect(200)
              .expect(xmlPayload2, done);
          });
        });
    });
  });

  it('responds with a URL encoded partial record edit feature switch on PATCH /booking', function(done){
    helpers.setEnv('form', 'string', 'full', 'partial', 'server', 'basic', 'nov1', function(server){

      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payload))
        .then(function(res){
          request(server)
            .patch('/booking/' + res.text.match(/[0-9]/)[0])
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(formurlencoded(partialPayload))
            .expect(200)
            .expect(formurlencoded(payload2), done);
        })
    });
  });

  it('responds with a 404 calling PATCH /booking when in full mode', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'nov1', function(server){
        request(server)
          .patch('/booking/1')
          .set('Accept', 'application/json')
          .send(partialPayload)
          .expect(404, done);
    });
  });

  it('responds with a 404 calling PUT /booking when in partial mode', function(done){
    helpers.setEnv('json', 'string', 'full', 'partial', 'server', 'basic', 'nov1', function(server){
        request(server)
          .put('/booking/1')
          .set('Accept', 'application/json')
          .send(payload)
          .expect(404, done);
    });
  });

});
