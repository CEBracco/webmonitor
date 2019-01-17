var urlExists = require('url-exists-deep');
var logger =  require('../../logger.js');
var config =  require('../../config/config.js');
var numberOfAttemps = config.get('RECHECK_INMEDIATLY_NUMBER_OF_ATTEMPTS');
var checkTimeout = config.get('CHECK_TIMEOUT');

function recheck(municipality,upFunction,downFunction,attempts = numberOfAttemps){
  if(attempts > 0){
    logger.debug('Rechecking '+ municipality.nombre);
    urlExists(municipality.urlMunicipio,{},'HEAD',checkTimeout * 1000)
    .then(function(response){
      if (response) {
        upFunction(municipality);
      } else {
        recheck(municipality,upFunction,downFunction,attempts - 1);
      }
    })
    .catch(function(){
      recheck(municipality,upFunction,downFunction,attempts - 1);
    });
  } else {
    downFunction(municipality);
  }
}

module.exports = {
  recheck:recheck
}
