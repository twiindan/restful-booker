var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    helpers      = require('./helpers'),
    js2xmlparser = require("js2xmlparser"),
    xml2js       = require('xml2js').parseString,
    formurlencoded = require('form-urlencoded');

var payload  = helpers.generateDobPayload('Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', 'over21'),
    payload2 = helpers.generateDobPayload('Geoff', 'White', 111, true, 'Breakfast', '2013-02-02', '2013-02-05', 'over21');
    partialPayload = {
      'firstname': 'Geoff',
      'lastname': 'White',
      'bookingdates': {
        'checkin': '2013-02-02',
        'checkout': '2013-02-05'
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
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/auth')
            .send({'username': 'admin', 'password': 'password123'})
        })
        .then(function(res){
          request(server)
            .put('/booking/1')
            .set('Accept', 'application/json')
            .set('Cookie', 'token=' + res.body.token)
            .send(payload2)
            .expect(200)
            .expect(payload2, done);
        })
    });
  });

  it('responds with a 200 and updated payload using XML full record edit feature switch on PUT /booking', function(done){
    helpers.setEnv('xml', 'string', 'full', 'full', function(server){
      xmlPayload = js2xmlparser('booking', payload);
      xmlPayload2 = js2xmlparser('booking', payload2);

      var token;

      request(server)
        .post('/auth')
        .set('Content-type', 'text/xml')
        .send('<auth><username>admin</username><password>password123</password></auth>')
        .then(function(res){
          xml2js(res.text, {explicitArray: false}, function (err, result) {
            token = result.token
          });
          return request(server)
            .post('/booking')
            .set('Content-type', 'text/xml')
            .send(xmlPayload)
        })
        .then(function(res){
          return xml2js(res.text, {explicitArray: false, valueProcessors: [parseNumbers, parseBooleans]}, function (err, result) {
            request(server)
              .put('/booking/' + result['created-booking'].bookingid)
              .set('Cookie', 'token=' + token)
              .set('Content-type', 'text/xml')
              .send(xmlPayload2)
              .expect(200)
              .expect(xmlPayload2, done);
          });
        });
    });
  });

  it('responds with a 200 and updated payload using URL encoded full record edit feature switch on PUT /booking', function(done){
    helpers.setEnv('form', 'string', 'full', 'full', function(server){
      var token;

      request(server)
        .post('/auth')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send('username=admin&password=password123')
        .then(function(res){
          token = res.text;
          return request(server)
            .post('/booking')
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(formurlencoded(payload))
        })
        .then(function(res){
          request(server)
            .put('/booking/' + res.text.match(/[0-9]/)[0])
            .set('Cookie', 'token=' + token)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(formurlencoded(payload2))
            .expect(200)
            .expect(formurlencoded(payload2), done);
        })
    });
  });

  it('responds with a 400 when sending a partial payload in full edit mode', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/auth')
            .send({'username': 'admin', 'password': 'password123'})
        })
        .then(function(res){
          request(server)
            .put('/booking/1')
            .set('Accept', 'application/json')
            .set('Cookie', 'token=' + res.body.token)
            .send(partialPayload)
            .expect(400, done);
        })
    });
  });

  it('responds with a JSON partial record edit feature switch on PUT /booking', function(done){
    helpers.setEnv('json', 'string', 'full', 'partial', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/auth')
            .send({'username': 'admin', 'password': 'password123'})
        })
        .then(function(res){
          request(server)
            .put('/booking/1')
            .set('Accept', 'application/json')
            .set('Cookie', 'token=' + res.body.token)
            .send(partialPayload)
            .expect(200)
            .expect(payload2, done);
        })
    });
  });

  it('responds with a XML partial record edit feature switch on PUT /booking', function(done){
    helpers.setEnv('xml', 'string', 'full', 'partial', function(server){
      xmlPayload = js2xmlparser('booking', payload);
      xmlPayload2 = js2xmlparser('booking', payload2);
      xmlPartialPayload = js2xmlparser('booking', partialPayload);

      var token;

      request(server)
        .post('/auth')
        .set('Content-type', 'text/xml')
        .send('<auth><username>admin</username><password>password123</password></auth>')
        .then(function(res){
          xml2js(res.text, {explicitArray: false}, function (err, result) {
            token = result.token
          });
          return request(server)
            .post('/booking')
            .set('Content-type', 'text/xml')
            .send(xmlPayload)
        })
        .then(function(res){
          return xml2js(res.text, {explicitArray: false, valueProcessors: [parseNumbers, parseBooleans]}, function (err, result) {
            request(server)
              .put('/booking/' + result['created-booking'].bookingid)
              .set('Cookie', 'token=' + token)
              .set('Content-type', 'text/xml')
              .send(xmlPartialPayload)
              .expect(200)
              .expect(xmlPayload2, done);
          });
        });
    });
  });

  it('responds with a URL encoded partial record edit feature switch on PUT /booking', function(done){
    helpers.setEnv('form', 'string', 'full', 'partial', function(server){
      var token;

      request(server)
        .post('/auth')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send('username=admin&password=password123')
        .then(function(res){
          token = res.text;
          return request(server)
            .post('/booking')
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(formurlencoded(payload))
        })
        .then(function(res){
          request(server)
            .put('/booking/' + res.text.match(/[0-9]/)[0])
            .set('Cookie', 'token=' + token)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(formurlencoded(partialPayload))
            .expect(200)
            .expect(formurlencoded(payload2), done);
        })
    });
  });

});
