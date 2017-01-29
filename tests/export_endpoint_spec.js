var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    helpers      = require('./helpers');

var payload  = helpers.generateDobPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01T00:00:00.000Z', '2080-01-02T00:00:00.000Z', 'over21'),
    payload2 = helpers.generateDobPayload('Geoff', 'White', 111, true, 'Breakfast', '2080-01-01T00:00:00.000Z', '2080-01-02T00:00:00.000Z', 'over21');

describe('restful-booker - /Export authorisation feature switch', function () {

  it('should return a 200 when GET /export with good basic authorisation', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'nov1', function(server){
      request(server)
        .get('/export')
        .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
        .expect(200, done);
    });
  });

  it('should return a 403 when GET /export with bad basic authorisation', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'nov1', function(server){
      request(server)
        .get('/export')
        .set('Authorization','asdaskjdhasd')
        .expect(403, done);
    });
  });

  it('should return a 200 when GET /export with a good query token and then a 403 on second use', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'query', 'nov1', function(server){
      var token;

      request(server)
        .post('/auth')
        .send({'username': 'admin', 'password': 'password123'})
        .expect(200)
        .then(function(res){
          token = res.body.token;
          return request(server)
            .get('/export?token=' + token)
            .expect(200)
        })
        .then(function(res){
          request(server)
            .get('/export?token=' + token)
            .expect(403, done)
        })
    });
  });

  it('should return a 403 when GET /export with bad query string', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'query', 'nov1', function(server){
      request(server)
        .get('/export?token=abcde12345')
        .expect(403, done);
    });
  });

  it('should return a 200 when GET /export with good token', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'token', 'nov1', function(server){
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
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'token', 'nov1', function(server){
      request(server)
        .get('/export')
        .expect(403, done)
    });
  });

});

describe('restful-booker - /Export authorisation feature switch', function () {

  it('should return a 200 and a JSON payload when using no version feature', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'nov1', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        })
        .then(function(){
          request(server)
            .get('/export')
            .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
            .expect(200)
            .expect(function(res){
              var response = {
                'record0' : 'Sally Brown - 111',
                'record1' : 'Geoff White - 111'
              }
              res.body.should.deep.equal(response)
            })
            .end(done);
        })
    });
  });

  it('should return a 200 and a JSON payload when using version feature', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'nov2', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        })
        .then(function(){
          request(server)
            .get('/export')
            .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
            .expect(200)
            .expect(function(res){
              res.body[0].should.deep.equal(payload)
              res.body[1].should.deep.equal(payload2)
            })
            .end(done);
        })
    });
  });

  it('should return a 200 and a JSON payload when using no version feature', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'yesv1', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        })
        .then(function(){
          request(server)
            .get('/export/v1')
            .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
            .expect(200)
            .expect(function(res){
              var response = {
                'record0' : 'Sally Brown - 111',
                'record1' : 'Geoff White - 111'
              }
              res.body.should.deep.equal(response)
            })
            .end(done);
        })
    });
  });

  it('should return a 200 and a JSON payload when using version feature', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'yesv2', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        })
        .then(function(){
          request(server)
            .get('/export/v2')
            .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
            .expect(200)
            .expect(function(res){
              res.body[0].should.deep.equal(payload)
              res.body[1].should.deep.equal(payload2)
            })
            .end(done);
        })
    });
  });

  it('should return a 404 when no version is used and version URI is called', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'nov1', function(server){
      request(server)
        .get('/export/v1')
        .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
        .expect(404, done);
    });
  });

  it('should return a 404 when version is used and no version URI is called', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'yesv1', function(server){
      request(server)
        .get('/export')
        .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
        .expect(404, done);
    });
  });

  it('should return a 404 when version one is used and version two is called', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'yesv1', function(server){
      request(server)
        .get('/export/v2')
        .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
        .expect(404, done);
    });
  });

  it('should return a 404 when version one is used and version three is called', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', 'basic', 'yesv1', function(server){
      request(server)
        .get('/export/v3')
        .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
        .expect(404, done);
    });
  });

});
