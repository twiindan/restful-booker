var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    helpers      = require('./helpers'),
    formurlencoded = require('form-urlencoded');

var payload  = helpers.generateDobPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21'),
    payload2 = helpers.generateDobPayload('Geoff', 'White', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');

describe('restful-booker - Form feature switch', function () {

  it('responds with a query string payload when GET /booking form feature switch', function(done){
    helpers.setEnv('form', 'string', 'full', 'full', 'server', 'basic', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payload))
        .then(function() {
            return request(server)
                    .post('/booking')
                    .set('Content-type', 'application/x-www-form-urlencoded')
                    .send(formurlencoded(payload2))
        })
        .then(function(){
          request(server)
            .get('/booking')
            .expect(200)
            .expect(function(res){
              res.text.should.equal('0%5Bid%5D=1&1%5Bid%5D=2')
            })
            .end(done)
        })
    });
  });

  it('responds with an query string payload when GET /booking/{id} form feature switch', function(done){
    helpers.setEnv('form', 'string', 'full', 'full', 'server', 'basic', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payload))
        .then(function(res){
          request(server)
            .get('/booking/' + res.text.match(/[0-9]/)[0])
            .expect(200)
            .expect(formurlencoded(payload), done);
        });
    });
  });

  it('responds with an query string payload when POST /booking form feature switch', function(done){
    helpers.setEnv('form', 'string', 'full', 'full', 'server', 'basic', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payload))
        .expect(200)
        .expect(function(res){
          res.text.should.equal(formurlencoded({'bookingid': 1, 'booking': payload}));
        })
        .end(done);
    });
  });

  it('responds with a 200 and a token to use when POSTing a valid credential', function(done){
    helpers.setEnv('form', 'string', 'full', 'full', 'server', 'basic', function(server){
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
  });

  it('responds with a 200 and a message informing of login failed when POSTing invalid credential', function(done){
    helpers.setEnv('form', 'string', 'full', 'full', 'server', 'basic', function(server){
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
  });

});
