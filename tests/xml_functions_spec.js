var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    js2xmlparser = require("js2xmlparser"),
    assert       = require('assert'),
    xml2js       = require('xml2js').parseString,
    helpers      = require('./helpers');

var payload  = helpers.generateDobPayload('Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', 'over21'),
    payload2 = helpers.generateDobPayload('Geoff', 'White', 111, true, 'Breakfast', '2013-02-02', '2013-02-05', 'over21');

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

describe('restful-booker - XML feature switch', function () {

  it('responds with an XML payload when GET /booking XML feature switch', function(done){
    helpers.setEnv('xml', 'string', 'full', 'full', 'server', function(server){
      xmlPayload  = js2xmlparser('booking', payload);
      xmlPayload2 = js2xmlparser('booking', payload2);

      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(xmlPayload)
        .then(function() {
            return request(server)
                    .post('/booking')
                    .set('Content-type', 'text/xml')
                    .send(xmlPayload2)
        })
        .then(function(){
          request(server)
            .get('/booking')
            .expect(200)
            .expect(function(res){
              res.text.should.equal('<?xml version="1.0" encoding="UTF-8"?>\n<bookings>\n\t<booking>\n\t\t<id>1</id>\n\t</booking>\n\t<booking>\n\t\t<id>2</id>\n\t</booking>\n</bookings>')
            })
            .end(done)
        })
    });
  });

  it('responds with an XML payload when GET /booking/{id} XML feature switch', function(done){
    helpers.setEnv('xml', 'string', 'full', 'full', 'server', function(server){
      xmlPayload = js2xmlparser('booking', payload);

      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(xmlPayload)
        .then(function(res){
          xml2js(res.text, {explicitArray: false, valueProcessors: [parseNumbers, parseBooleans]}, function (err, result) {
            request(server)
              .get('/booking/' + result['created-booking'].bookingid)
              .set('Accept', 'application/xml')
              .expect(200)
              .expect(xmlPayload, done);
          });
        });
    });
  });

  it('responds with an XML payload when POST /booking XML feature switch', function(done){
    helpers.setEnv('xml', 'string', 'full', 'full', 'server', function(server){
      var xmlPayload = js2xmlparser('booking', payload);
      var xmlResponsePayload = js2xmlparser('created-booking', { "bookingid": 1, "booking": payload })

      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(xmlPayload)
        .expect(200)
        .expect(function(res){
          xml2js(res.text, {explicitArray: false, valueProcessors: [parseNumbers, parseBooleans]}, function (err, result) {
            result['created-booking'].booking.should.deep.equal(payload);
            result['created-booking'].bookingid.should.equal(1);
          });
        })
        .end(done);
      });
  });

  it('responds with a 200 and a token to use when POSTing a valid credential', function(done){
    helpers.setEnv('xml', 'string', 'full', 'full', 'server', function(server){
      request(server)
        .post('/auth')
        .set('Content-type', 'text/xml')
        .send('<auth><username>admin</username><password>password123</password></auth>')
        .expect(200)
        .expect(function(res){
          res.text.should.match(/<token>[a-zA-Z0-9]{15,}<\/token>/);
        })
        .end(done)
    });
  });

  it('responds with a 200 and a message informing of login failed when POSTing invalid credential', function(done){
    helpers.setEnv('xml', 'string', 'full', 'full', 'server', function(server){
      request(server)
        .post('/auth')
        .set('Content-type', 'text/xml')
        .send('<auth><username>nimda</username><password>321drowssap</password></auth>')
        .expect(200)
        .expect(function(res){
          res.body.should.have.property('reason').and.to.equal('Bad credentials');
        })
        .end(done)
    });
  });

});
