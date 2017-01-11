var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    helpers      = require('./helpers'),
    dateformat   = require('dateformat');

describe('restful-booker - Validation of payloads', function(){

  it('should return a 400 when less than 2 characters are provided for firstname', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.firstname = 'a';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 400 when more than 25 characters are provided for firstname', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.firstname = 'abcdefghijklmnopqrstuvwxyz';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 200 when more than 25 characters are provided for firstname that include whitespace', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.firstname = ' bcdefghijklmnopqrstuvwxy ';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(200, done)
    });
  });

  it('should return a 400 when less than 2 characters are provided for lastname', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.lastname = 'a';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 400 when more than 25 characters are provided for lastname', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.lastname = 'abcdefghijklmnopqrstuvwxyz';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 200 when more than 25 characters are provided for lastname that include whitespace', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.lastname = ' bcdefghijklmnopqrstuvwxy ';

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(200, done)
    });
  });

  it('should return a 400 when the checkin date is after the checkout date', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tomorrow = new Date();
      var nextDay = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      nextDay.setDate(nextDay.getDate() + 2);

      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.bookingdates.checkin = dateformat(nextDay, "yyyy-mm-dd");
      tmpPayload.bookingdates.checkout = dateformat(tomorrow, "yyyy-mm-dd");

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 400 when the checkin date is before today', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var date = new Date();
      date.setDate(date.getDate() - 1);

      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.bookingdates.checkin = dateformat(date, "yyyy-mm-dd");
      tmpPayload.bookingdates.checkout = "2080-01-01";

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 400 when the checkout date is after the end of 2099', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var date = new Date('2100', '01', '01');

      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.bookingdates.checkout = dateformat(date, "yyyy-mm-dd");

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 400 when the total price is less than 0', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.totalprice = -1;

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 400 when the total price is a decimal points', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'server', function(server){
      var tmpPayload = helpers.generateDobObjPayload('Sally', 'Brown', 111, true, 'Breakfast', '2080-01-01', '2080-01-02', 'over21');;
      tmpPayload.totalprice = 1.234;

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(400, done)
    });
  });

  it('should return a 200 when server side validation is switch off', function(done){
    helpers.setEnv('json', 'string', 'full', 'full', 'client', function(server){
      var tmpPayload = helpers.generateDobObjPayload('a', 'b', 1.234, true, 'Breakfast', '2080-01-02', '2080-01-02', 'over21');;
      tmpPayload.totalprice = 1.234;

      request(server)
        .post('/booking')
        .send(tmpPayload)
        .expect(200, done)
    });
  });

});
