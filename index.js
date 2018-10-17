require("date-format-lite");

var SSL_WARNING_DAYS_TOLERANCE = -10;
var CHECK_INTERVAL = 1;
var CHECK_SSL_INTERVAL = 5;

var logger =  require('./logger.js');
var municipalities = [];

function loadMunicipalities(){
  var fs = require('fs');
  var obj = JSON.parse(fs.readFileSync('municipalities.json', 'utf8'));
  municipalities = obj.municipalities;
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

  sslCertificate.get(municipality.urlSem.replace('https://',''))
    .then(function (certificate) {
      if(sslCertificateIsValid(certificate)){
        sslValid(municipality,certificate);
      } else {
        sslNotValid(municipality,certificate);
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
  var comparableToDate = originalToDate.add(SSL_WARNING_DAYS_TOLERANCE, "days");
  return new Date() >= comparableToDate;
}

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
        isUp(municipality);
      } else {
        isDown(municipality);
      }
    })
    .catch(function(){
      isDown(municipality);
    });
}

function isUp(municipality){
  // logger.info(municipality.nombre + " is UP!");
}

function isDown(municipality){
  logger.warn(municipality.nombre + " is DOWN!");
}

function sslValid(municipality,certificate){
  if(sslCertificateIsGoingToExpire(certificate)){
    logger.info(`${municipality.nombre} SSL cert is valid. but is going to expire soon! (expire date: ${new Date(certificate.valid_to).format("DD/MM/YYYY")})`);
  } else {
    // logger.info(`${municipality.nombre} SSL cert is valid!`)
  }
}

function sslNotValid(municipality,certificate){
  logger.warn(`${municipality.nombre} SSL cert is EXPIRED! (expire date: ${new Date(certificate.valid_to).format("DD/MM/YYYY")})`);
}

loadMunicipalities();
validateMunicipalitiesSsl();
checkMunicipalities();
setInterval(validateMunicipalitiesSsl, CHECK_SSL_INTERVAL * 60000);
setInterval(checkMunicipalities, CHECK_INTERVAL * 60000);
