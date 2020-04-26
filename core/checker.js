var logger = require('../logger.js');
var config = require('../config/config.js');
var urlExists = require('url-exists-deep');
var recheckStrategy = require(`./recheckStrategies/${config.get('RECHECK_STRATEGY')}Strategy.js`);
var municipalities = [];
var upFunction = function () { };
var downFunction = function () { };
var checkTimeout = config.get('CHECK_TIMEOUT');
var checkMethod = config.get('CHECK_METHOD');

function isMonitoringEnabled(municipality, excludeNonSSL = false) {
  if ('monitor' in municipality && !municipality.monitor) {
    return false;
  }
  if (excludeNonSSL) {
    return !eval(/(http:\/\/)?[0-9]{1,3}[\.\/].*/g).test(municipality.urlMunicipio);
  }
  return true;
}

function checkMunicipalities() {
  logger.debug("Check instances...");
  for (var i = 0; i < municipalities.length; i++) {
    if (isMonitoringEnabled(municipalities[i])) {
      checkMunicipality(municipalities[i])
    }
  }
}

function checkMunicipality(municipality) {
  checkMethod == 'core' ? checkCore(municipality) : checkWeb(municipality);
}

function checkCore(municipality) {
  var unirest = require('unirest');
  unirest('POST', `${municipality.urlCore}/deploy/status`)
    .timeout(checkTimeout * 1000)
    .end(function (res) {
      if (res.error) {
        recheckStrategy.recheck(municipality, upFunction, downFunction);
      } else {
        upFunction(municipality);
      }
    });
}

function checkWeb(municipality) {
  urlExists(municipality.urlMunicipio, {}, 'HEAD', checkTimeout * 1000)
    .then(function (response) {
      if (response) {
        upFunction(municipality);
      } else {
        recheckStrategy.recheck(municipality, upFunction, downFunction);
      }
    })
    .catch(function () {
      recheckStrategy.recheck(municipality, upFunction, downFunction);
    });
}

function execute(instances, upFn, downFn) {
  var checkInterval = config.get('CHECK_INTERVAL');
  upFunction = upFn;
  downFunction = downFn;
  municipalities = instances;
  checkMunicipalities();
  setInterval(checkMunicipalities, checkInterval * 1000);
}

module.exports = {
  execute: execute
}
