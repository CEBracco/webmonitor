var urlExists = require('url-exists-deep');
var logger = require('../../logger.js');
var config = require('../../config/config.js');
var numberOfAttemps = config.get('RECHECK_INMEDIATLY_NUMBER_OF_ATTEMPTS');
var checkTimeout = config.get('CHECK_TIMEOUT');
var checkMethod = config.get('CHECK_METHOD');

function recheck(municipality, upFunction, downFunction, attempts = numberOfAttemps) {
  if (attempts > 0) {
    logger.debug('Rechecking ' + municipality.nombre);
    checkMethod == 'core' ? checkCore(municipality, upFunction, downFunction, attempts) : checkWeb(municipality, upFunction, downFunction, attempts);
  } else {
    downFunction(municipality);
  }
}

function checkCore(municipality, upFunction, downFunction, attempts) {
  var unirest = require('unirest');
  unirest('POST', `${municipality.urlCore}/deploy/status`)
    .timeout(checkTimeout * 1000)
    .end(function (res) {
      if (res.error) {
        recheck(municipality, upFunction, downFunction, attempts - 1);
      } else {
        upFunction(municipality);
      }
    });
}

function checkWeb(municipality, upFunction, downFunction, attempts) {
  urlExists(municipality.urlMunicipio, {}, 'HEAD', checkTimeout * 1000)
    .then(function (response) {
      if (response) {
        upFunction(municipality);
      } else {
        recheck(municipality, upFunction, downFunction, attempts - 1);
      }
    })
    .catch(function () {
      recheck(municipality, upFunction, downFunction, attempts - 1);
    });
}

module.exports = {
  recheck: recheck
}
