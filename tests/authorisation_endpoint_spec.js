var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    helpers      = require('./helpers');

describe('restful-booker - Authorisation feature switch', function () {

  it('should return a 200 when GET /export with good basic authorisation', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', function(server){
      request(server)
        .get('/export')
        .set('Authorization','YWRtaW46cGFzc3dvcmQxMjM=')
        .expect(403, done);
    });
  });

  it('should return a 403 when GET /export with bad basic authorisation', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', function(server){
      request(server)
        .get('/export')
        .set('Authorization','asdaskjdhasd')
        .expect(403, done);
    });
  });

  it('should return a 200 when GET /export with good query string', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'query', function(server){
      request(server)
        .get('/export?username=admin&password=password123')
        .expect(200, done);
    });
  });

  it('should return a 403 when GET /export with bad query string', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'query', function(server){
      request(server)
        .get('/export?username=nimda&password=321drowssap')
        .expect(403, done);
    });
  });

  it('should return a 200 when GET /export with good token', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'token', function(server){
      request(server)
        .post('/auth')
        .send({'username': 'admin', 'password': 'password123'})
        .expect(200)
        .then(function(res){
          request(server)
            .get('/export')
            .set('Cookie','token=' + res.body.token)
            .expect(200, done)
        });
    });
  });

  it('should return a 403 when GET /export with bad token', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'token', function(server){
      request(server)
        .get('/export')
        .expect(403, done)
    });
  });

});
