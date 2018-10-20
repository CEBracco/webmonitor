var NUMBER_OF_ATTEMPTS = 5;
var urlExists = require('url-exists-deep');
var logger =  require('../../logger.js');

function recheck(municipality,upFunction,downFunction,attempts = NUMBER_OF_ATTEMPTS){
  if(attempts > 0){
    logger.debug('Rechecking '+ municipality.nombre);
    urlExists(municipality.urlSem)
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
