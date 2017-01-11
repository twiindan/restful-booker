var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    helpers      = require('./helpers');

var payload  = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', 'over21');

describe('restful-booker - Validation of payloads', function(){

  it('should return a 400 when less than 2 characters are provided for firstname', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = payload;
      tmpPayload.firstname = 'a';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 400 when more than 25 characters are provided for firstname', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = payload;
      tmpPayload.firstname = 'abcdefghijklmnopqrstuvwxyz';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 200 when more than 25 characters are provided for firstname that include whitespace', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = payload;
      tmpPayload.firstname = ' bcdefghijklmnopqrstuvwxy ';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(200, done)
    });
  });

  it('should return a 400 when less than 2 characters are provided for lastname', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = payload;
      tmpPayload.lastname = 'a';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 400 when more than 25 characters are provided for lastname', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = payload;
      tmpPayload.lastname = 'abcdefghijklmnopqrstuvwxyz';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 200 when more than 25 characters are provided for lastname that include whitespace', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = payload;
      tmpPayload.lastname = ' bcdefghijklmnopqrstuvwxy ';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(200, done)
    });
  });

});
