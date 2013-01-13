var async = require('async');
var dns = require('dns');
var request = require('request');

var client = exports.client = function (options) {
  this.options = options;
};

var WHOAPI_URL = 'http://api.whoapi.com';

client.prototype.whoApiAvailable = function (name, cb) {
  request.get({
    url: WHOAPI_URL,
    qs: {
      domain: name,
      r: 'taken',
      apikey: this.options.whoApiKey
    },
    json: true
  }, function (err, response, result) {
    result.provider = 'whoapi';

    if (result.taken) {
      if (result.taken === '1') {
        return cb(err, false, result);
      }

      if (result.taken === '0') {
        return cb(err, true, result);
      }
    }

    cb(err, true, result);
  });
};

client.prototype.dnsAvailable = function (name, cb) {
  var data = {
    provider: 'dns'
  };

  dns.lookup(name, function (err, address, family) {
    data.err = err;

    if (err && err.code === dns.NOTFOUND) {
      return cb(null, true, data);
    } else if (err) {
      return cb(err);
    }

    data.address = address;
    data.family = family;

    cb(null, false, data);
  });
};

client.prototype.available = function (name, cb) {
  var self = this;

  this.dnsAvailable(name, function (err, available, data) {
    if (err) return cb(err);

    if (available && self.options.whoApiKey) {
      return self.whoApiAvailable(name, cb);
    }

    cb(err, available, data);
  });
};
