var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    helpers      = require('./helpers');

var payload  = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', 'over21'),
    payload2 = helpers.generateDobObjPayload('Geoff', 'White', 111, true, 'Breakfast', '2013-02-02', '2013-02-05', 'over21'),
    payload3 = helpers.generateDobObjPayload('Bob', 'Brown', 111, true, 'Breakfast', '2013-02-03', '2013-02-06', 'over21');

describe('restful-booker', function () {

  it('responds to /ping', function testPing(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .get('/ping')
        .expect(201, done);
    });
  });

  it('404 everything else', function testPath(done) {
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .get('/foo/bar')
        .expect(404, done);
    });
  });

});

describe('restful-booker - GET /booking - JSON feature switch', function () {

  it('responds with all booking ids when GET /booking', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        }).then(function(){
          request(server)
            .get('/booking')
            .expect(200)
            .expect(function(res){
              res.body[0].should.have.property('id').and.match(/[0-9]/);
              res.body[1].should.have.property('id').and.match(/[0-9]/);
            })
            .end(done);
        });
    });
  });

  it('responds with a subset of booking ids when searching by firstname date', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        }).then(function(){
          request(server)
            .get('/booking?firstname=Geoff')
            .expect(200)
            .expect(function(res){
              res.body[0].should.have.property('id').and.equal(2);
            })
            .end(done)
        })
    });
  });

  it('responds with a subset of booking ids when searching by lastname date', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        }).then(function(){
          request(server)
            .get('/booking?lastname=White')
            .expect(200)
            .expect(function(res){
              res.body[0].should.have.property('id').and.equal(2);
            })
            .end(done)
        })
    });
  });

  it('responds with a subset of booking ids when searching for checkin date', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        }).then(function(){
          request(server)
            .get('/booking?checkin=2013-02-01')
            .expect(200)
            .expect(function(res){
              res.body[0].should.have.property('id').and.equal(2);
            })
            .end(done)
        })
    });
  });

  it('responds with a subset of booking ids when searching for checkout date', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        }).then(function(){
          request(server)
            .get('/booking?checkout=2013-02-05')
            .expect(200)
            .expect(function(res){
              res.body[0].should.have.property('id').and.equal(1);
            })
            .end(done)
        })
    });
  });

  it('responds with a subset of booking ids when searching for checkin and checkout date', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        }).then(function(){
          return request(server)
            .post('/booking')
            .send(payload3)
        }).then(function(){
          request(server)
            .get('/booking?checkin=2013-02-01&checkout=2013-02-06')
            .expect(200)
            .expect(function(res){
              res.body[0].should.have.property('id').and.equal(2);
            })
            .end(done)
        });
      });
  });

  it('responds with a subset of booking ids when searching for name, checkin and checkout date', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          return request(server)
            .post('/booking')
            .send(payload2)
        }).then(function(){
          return request(server)
            .post('/booking')
            .send(payload3)
        }).then(function(){
          request(server)
            .get('/booking?firstname=Geoff&lastname=White&checkin=2013-02-01&checkout=2013-02-06')
            .expect(200)
            .expect(function(res){
              res.body[0].should.have.property('id').and.equal(2);
            })
            .end(done)
        })
    });
  });

  it('responds with a 500 error when GET /booking with a bad date query string', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .get('/booking?checkout=2013-02-0')
        .expect(500, done)
    });
  });

  it('responds with a page of entries when GET /booking is feature flagged with pagination', function(done) {
    this.timeout(10000);

    helpers.setEnv('json', 'string', 'page', 'full', function(server){
      var count = 0;
      var limit = 15;

      (generatePayloads = function(){
        var tmpPayload = payload;
        tmpPayload.firstname = 'Entry ' + count;

        request(server)
          .post('/booking')
          .send(payload)
          .end(function(){
            if(count < 15){
                count++
                generatePayloads();
            } else {
              request(server)
                .get('/booking?page=1')
                .expect(200)
                .expect(function(res){
                  res.body.length.should.equal(10)
                })
                .then(function(){
                  request(server)
                    .get('/booking?page=2')
                    .expect(200)
                    .expect(function(res){
                      res.body.length.should.equal(6)
                    })
                    .end(done)
                })
            }
          })
      })();
    });
  });

  it('responds with a payload when GET /booking/{id}', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(res){
          request(server)
            .get('/booking/1')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(payload, done)
        });
    });
  });

});

describe('restful-booker - POST /booking - JSON feature switch', function () {

  it('responds with the created booking and assigned booking id', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Accept', 'application/json')
        .send(payload)
        .expect(200)
        .expect(function(res){
          res.body.bookingid.should.equal(1);
          res.body.booking.should.deep.equal(payload);
        })
        .end(done)
    });
  });

  it('responds with the correct assigned booking id when multiple payloads are sent', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(){
          request(server)
            .post('/booking')
            .send(payload2)
            .set('Accept', 'application/json')
            .expect(200)
            .expect(function(res) {
              res.body.bookingid.should.equal(2);
            })
            .end(done)
        })
    });
  });

  it('responds with a 200 when a payload with too many params are sent', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      var extraPayload = payload
      extraPayload.extra = 'bad'

      request(server)
        .post('/booking')
        .set('Accept', 'application/json')
        .send(extraPayload)
        .expect(200, done);
    });
  });

});

describe('restful-booker POST /auth - JSON feature switch', function(){

  it('responds with a 200 and a token to use when POSTing a valid credential', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/auth')
        .send({'username': 'admin', 'password': 'password123'})
        .expect(200)
        .expect(function(res){
          res.body.should.have.property('token').and.to.match(/[a-zA-Z0-9]{15,}/);
        })
        .end(done)
    });
  })

  it('responds with a 200 and a message informing of login failed when POSTing invalid credential', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/auth')
        .send({'username': 'nimda', 'password': '321drowssap'})
        .expect(200)
        .expect(function(res){
          res.body.should.have.property('reason').and.to.equal('Bad credentials');
        })
        .end(done)
    });
  })

});

describe('restful-booker - PUT /booking - JSON feature switch', function () {

  // it('responds with a 403 when no token is sent', function(done){
  //   helpers.setEnv('json', 'string', 'full', 'full', function(server){
  //     request(server)
  //       .put('/booking/1')
  //       .expect(403, done);
  //   });
  // });
  //
  // it('responds with a 403 when not authorised', function(done){
  //   helpers.setEnv('json', 'string', 'full', 'full', function(server){
  //     request(server)
  //       .post('/auth')
  //       .send({'username': 'nmida', 'password': '321drowssap'})
  //       .expect(200)
  //       .then(function(res){
  //         request(server)
  //           .put('/booking/1')
  //           .set('Accept', 'application/json')
  //           .set('Cookie', 'token=' + res.body.token)
  //           .send(payload2)
  //           .expect(403, done)
  //       })
  //   });
  // });

  it('responds with a 200 and an updated payload using auth', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(res){
          request(server)
            .put('/booking/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQxMjM=')
            .send(payload2)
            .expect(200)
            .expect(payload2, done);
        })
    });
  });

  it('responds with a 405 when attempting to update a booking that does not exist', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
      .post('/auth')
      .send({'username': 'admin', 'password': 'password123'})
      .then(function(res){
        request(server)
          .put('/booking/100000')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + res.body.token)
          .send(payload2)
          .expect(405, done);
      })
    });
  });

});

describe('restful-booker DELETE /booking - JSON feature switch', function(){

  it('responds with a 403 when not authorised', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .delete('/booking/1')
        .expect(403, done);
    });
  });

  it('responds with a 403 when not authorised', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/auth')
        .send({'username': 'nmida', 'password': '321drowssap'})
        .expect(200)
        .then(function(res){
          request(server)
            .delete('/booking/1')
            .set('Cookie', 'token=' + res.body.token)
            .expect(403, done)
        })
    });
  })

  it('responds with a 201 when deleting an existing booking', function(done){
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
          return request(server)
            .delete('/booking/1')
            .set('Cookie', 'token=' + res.body.token)
            .expect(201)
        }).then(function(){
          request(server)
            .get('/booking/1')
            .expect(404, done)
        });
    });
  });

  it('responds with a 201 when deleting an existing booking with a basic auth header', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payload)
        .then(function(res){
          return request(server)
            .delete('/booking/1')
            .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQxMjM=')
            .expect(201)
        }).then(function(){
          request(server)
            .get('/booking/1')
            .expect(404, done)
        });
    });
  });

  it('responds with a 405 when deleting a non existing booking', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/auth')
        .send({'username': 'admin', 'password': 'password123'})
        .then(function(res){
          request(server)
            .delete('/booking/1')
            .set('Cookie', 'token=' + res.body.token)
            .expect(405, done)
        })
    });
  });

});
