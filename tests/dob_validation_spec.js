var request      = require('supertest-as-promised'),
    formurlencoded = require('form-urlencoded'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    helpers      = require('./helpers'),
    js2xmlparser = require("js2xmlparser");

var setDate = function(age){
  var d = new Date();
  var nd = new Date(d.setFullYear(d.getFullYear() - age))
  return nd.getFullYear() + '-' + (nd.getMonth() + 1) + '-' + nd.getDate();
}

var payloadBool  = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', true),
    payloadBool2 = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', false);

var payloadStr  = helpers.generateDobPayload('Sally', 'Payload1', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', 'over21'),
    payloadStr2 = helpers.generateDobPayload('Sally', 'Payload3', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', 'under21');

var payloadCompare  = helpers.generateDobPayload('Sally', 'Payload1', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', setDate(21)),
    payloadCompare2 = helpers.generateDobPayload('Sally', 'Payload2', 111, true, 'Breakfast', '2013-02-01', '2013-02-04', setDate(1));

describe('restful-booker - Boolean date validation feature switch', function () {

  it('should return a 200 when submitting valid boolean DOB validation - JSON', function(done){
    helpers.setEnv('json', 'boolean', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payloadBool)
        .expect(200, done);
    });
  });

  it('should return a 400 when submitting invalid boolean DOB validation - JSON', function(done){
    helpers.setEnv('json', 'boolean', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payloadBool2)
        .expect(400, done);
    });
  });

  it('should return a 200 when submitting valid boolean DOB validation - XML', function(done){
    var xmlPayload = js2xmlparser('booking', payloadBool);

    helpers.setEnv('xml', 'boolean', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(xmlPayload)
        .expect(200, done);
    });
  });

  it('should return a 400 when submitting invalid boolean DOB validation - XML', function(done){
    var xmlPayload = js2xmlparser('booking', payloadBool2);

    helpers.setEnv('xml', 'boolean', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(xmlPayload)
        .expect(400, done);
    });
  });

  it('should return a 200 when submitting valid boolean DOB validation - Form', function(done){
    helpers.setEnv('form', 'boolean', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payloadBool))
        .expect(200, done);
    });
  });

  it('should return a 400 when submitting invalid boolean DOB validation - Form', function(done){
    helpers.setEnv('form', 'boolean', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payloadBool2))
        .expect(400, done);
    });
  });

});

describe('restful-booker - String date validation feature switch', function () {

  it('should return a 200 when submitting valid string DOB validation - Form', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payloadStr)
        .expect(200, done)
    });
  });

  it('should return a 400 when submitting an invalid string DOB validation - JSON', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payloadStr2)
        .expect(400, done);
    });
  });

  it('should return a 200 when submitting valid string DOB validation - XML', function(done){
    helpers.setEnv('xml', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(js2xmlparser('booking', payloadStr))
        .expect(200, done);
    });
  });

  it('should return a 400 when submitting an invalid string DOB validation - XML', function(done){
    helpers.setEnv('xml', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(js2xmlparser('booking', payloadStr2))
        .expect(400, done);
    });
  });

  it('should return a 200 when submitting valid string DOB validation - Form', function(done){
    helpers.setEnv('form', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payloadStr))
        .expect(200, done)
    });
  });

  it('should return a 400 when submitting an invalid string DOB validation - Form', function(done){
    helpers.setEnv('form', 'string', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payloadStr2))
        .expect(400, done);
    });
  });

});

describe('restful-booker - GT/LT date validation feature switch', function () {

  it('should return a 200 when submitting a valid date above 21 - JSON', function(done){
    helpers.setEnv('json', 'compare', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payloadCompare)
        .expect(200, done)
    });
  });

  it('should return a 400 when submitting a valid date below 21 - JSON', function(done){
    helpers.setEnv('json', 'compare', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .send(payloadCompare2)
        .expect(400, done)
    });
  });

  it('should return a 200 when submitting a valid date above 21 - XML', function(done){
    helpers.setEnv('xml', 'compare', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(js2xmlparser('booking', payloadCompare))
        .expect(200, done)
    });
  });

  it('should return a 400 when submitting a valid date below 21 - XML', function(done){
    helpers.setEnv('xml', 'compare', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'text/xml')
        .send(js2xmlparser('booking', payloadCompare2))
        .expect(400, done)
    });
  });

  it('should return a 200 when submitting a valid date above 21 - Form', function(done){
    helpers.setEnv('form', 'compare', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payloadCompare))
        .expect(200, done)
    });
  });

  it('should return a 400 when submitting a valid date below 21 - Form', function(done){
    helpers.setEnv('form', 'compare', 'full', 'full', function(server){
      request(server)
        .post('/booking')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send(formurlencoded(payloadCompare2))
        .expect(400, done)
    });
  });

});
