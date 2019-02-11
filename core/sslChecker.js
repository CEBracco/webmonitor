require("date-format-lite");

var cron = require('node-cron');
var logger =  require('../logger.js');
var config = require('../config/config.js')
var municipalities = [];
var sslValidFunction = function(){};
var sslNotValidFunction = function(){};
var daysTolerance = -1;

function isMonitoringEnabled(municipality, excludeNonSSL = false){
  if(excludeNonSSL){
    return !eval(/(http:\/\/)?[0-9]{1,3}[\.\/].*/g).test(municipality.urlMunicipio) && municipality.habilitado;
  } else {
    return municipality.habilitado;
  }
}

function validateMunicipalitiesSsl(){
  logger.debug("Running SSL certs validation...");
  for (var i = 0; i < municipalities.length; i++) {
    if(isMonitoringEnabled(municipalities[i], true)){
      validateMunicipalitySsl(municipalities[i]);
    }
  }
}

function validateMunicipalitySsl(municipality){
  var sslCertificate = require("get-ssl-certificate")

  sslCertificate.get(municipality.urlMunicipio.replace('https://',''))
    .then(function (certificate) {
      if(sslCertificateIsValid(certificate)){
        sslValidFunction(municipality,sslCertificateIsGoingToExpire(certificate),certificate);
      } else {
        sslNotValidFunction(municipality,certificate);
      }
    })
    .catch(function(){
      logger.warn(`${municipality.nombre}, Problems obtaining SSL status.`)
    });
}

function sslCertificateIsValid(certificate){
  var originalToDate = new Date(certificate.valid_to);
  return new Date() < originalToDate;
}

function sslCertificateIsGoingToExpire(certificate){
  var originalToDate = new Date(certificate.valid_to);
  var comparableToDate = originalToDate.add(daysTolerance * -1, "days");
  return new Date() >= comparableToDate;
}

function execute(instances,sslValidFn,sslNotValidFn){
  var checkSslCronExpr = config.get('CHECK_SSL_CRON');
  daysTolerance = config.get('CHECK_SSL_WARNING_DAYS_TOLERANCE');
  sslValidFunction = sslValidFn;
  sslNotValidFunction = sslNotValidFn;
  municipalities = instances;
  cron.schedule(checkSslCronExpr, () => {
    validateMunicipalitiesSsl();
  });
}

module.exports = {
  execute:execute
}
