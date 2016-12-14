var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    mongoose     = require('mongoose'),
    js2xmlparser = require("js2xmlparser"),
    assert       = require('assert'),
    xml2js       = require('xml2js').parseString,
    helpers      = require('./helpers'),
    formurlencoded = require('form-urlencoded');

mongoose.createConnection('mongodb://localhost/restful-booker');

var payload  = helpers.generatePayload('Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04'),
    payload2 = helpers.generatePayload('Geoff', 'White', 111, true, 'Breakfast', '2013-02-02', '2013-02-05');

describe('restful-booker - XML feature switch', function () {

  beforeEach(function(){
    process.env['payload'] = 'form';
    delete require.cache[require.resolve('../app')];
    server = require('../app');

    mongoose.connection.db.dropDatabase();
  });

  it('responds with an XML payload when GET /booking/{id} XML feature switch', function testGetWithXMLAccept(done){
    request(server)
      .post('/booking')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(formurlencoded(payload))
      .then(function(res){
        request(server)
          .get('/booking/' + res.text.match(/[0-9]/)[0])
          .set('Accept', 'application/xml')
          .expect(200)
          .expect(formurlencoded(payload), done);
      });
  });

  it('responds with an XML payload when POST /booking XML feature switch', function testGetWithXMLAccept(done){
    request(server)
      .post('/booking')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(payload)
      .expect(200)
      .expect(function(res){
        res.text.should.equal(formurlencoded({'bookingid': 1, 'booking': payload}));
      })
      .end(done);
  });

  it('responds with a 200 and a token to use when POSTing a valid credential', function testAuthReturnsToken(done){
    request(server)
      .post('/auth')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send('username=admin&password=password123')
      .expect(200)
      .expect(function(res){
        res.text.should.match(/[a-zA-Z0-9]{15,}/);
      })
      .end(done)
  });

  it('responds with a 200 and a message informing of login failed when POSTing invalid credential', function testAuthReturnsError(done){
    request(server)
      .post('/auth')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send('username=nimda&password=321drowssap')
      .expect(200)
      .expect(function(res){
        res.body.should.have.property('reason').and.to.equal('Bad credentials');
      })
      .end(done)
  });

  it('responds with an XML payload when PUT /booking', function(done){
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
