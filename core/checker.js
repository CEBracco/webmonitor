var logger =  require('../logger.js');
var municipalities = [];
var upFunction = function(){};
var downFunction = function(){};

function isMonitoringEnabled(municipality, excludeNonSSL = false){
  if(excludeNonSSL){
    return !eval(/(http:\/\/)?[0-9]{1,3}[\.\/].*/g).test(municipality.urlSem) && municipality.monitor;
  } else {
    return municipality.monitor;
  }
}

function checkMunicipalities(){
  logger.debug("Check instances...");
  for (var i = 0; i < municipalities.length; i++) {
    if(isMonitoringEnabled(municipalities[i])){
      checkMunicipality(municipalities[i])
    }
  }
}

function checkMunicipality(municipality){
  var urlExists = require('url-exists-deep');
  urlExists(municipality.urlSem)
    .then(function(response){
      if (response) {
        upFunction(municipality);
      } else {
        downFunction(municipality);
      }
    })
    .catch(function(){
      downFunction(municipality);
    });
}

function execute(instances,checkInterval,upFn,downFn){
  upFunction = upFn;
  downFunction = downFn;
  municipalities = instances;
  checkMunicipalities();
  setInterval(checkMunicipalities, checkInterval * 60000);
}

module.exports = {
  execute:execute
}
