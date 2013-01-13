require('chai').should();

var names = require('..');

describe('names.client()', function () {
  var client;

  before(function () {
    client = new names.client({
      whoApiKey: process.env.WHOAPI_KEY
    });
  });

  it('should return a client', function () {
    client.dnsAvailable.should.be.a('function');
    client.whoApiAvailable.should.be.a('function');
  });

  describe('#whoApiAvailable', function () {
    it('should return false for domains that exist', function (done) {
      client.whoApiAvailable('whitehouse.gov', function (err, available) {
        if (err) return done(err);

        available.should.deep.equal(false);

        done();
      });
    });

    it('should return true for domains that don\'t exist', function (done) {
      client.whoApiAvailable('test.example', function (err, available) {
        if (err) return done(err);

        available.should.deep.equal(true);

        done();
      });
    });
  });

  describe('#dnsAvailable', function () {
    it('should return false for domains that exist', function (done) {
      client.dnsAvailable('whitehouse.gov', function (err, available) {
        if (err) return done(err);

        available.should.deep.equal(false);

        done();
      });
    });

    it('should return true for domains that don\'t exist', function (done) {
      client.dnsAvailable('test.example', function (err, available) {
        if (err) return done(err);

        available.should.deep.equal(true);

        done();
      });
    });
  });

  describe('#available', function () {
    it('should cascade properly', function (done) {
      client.available('repeal-ndaa.gov', function (err, available, data) {
        if (err) return done(err);

        available.should.deep.equal(true);

        data.provider.should.equal('whoapi');

        done();
      });
    });
  });
});
