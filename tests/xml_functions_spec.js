var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    mongoose     = require('mongoose'),
    js2xmlparser = require("js2xmlparser"),
    assert       = require('assert'),
    xml2js       = require('xml2js').parseString,
    helpers      = require('./helpers');

mongoose.createConnection('mongodb://localhost/restful-booker');

var payload  = helpers.generatePayload('Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04'),
    payload2 = helpers.generatePayload('Geoff', 'White', 111, true, 'Breakfast', '2013-02-02', '2013-02-05');

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

  beforeEach(function(){
    process.env['payload'] = 'xml';
    delete require.cache[require.resolve('../app')];
    server = require('../app');

    mongoose.connection.db.dropDatabase();
  });

  it('responds with an XML payload when GET /booking/{id} XML feature switch', function testGetWithXMLAccept(done){
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

  it('responds with an XML payload when POST /booking XML feature switch', function testGetWithXMLAccept(done){
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

  it('responds with a 200 and a token to use when POSTing a valid credential', function testAuthReturnsToken(done){
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

  it('responds with a 200 and a message informing of login failed when POSTing invalid credential', function testAuthReturnsError(done){
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

  it('responds with an XML payload when PUT /booking', function testPutWithXMLAccept(done){
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
