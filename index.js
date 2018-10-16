require("date-format-lite");

var SSL_WARNING_DAYS_TOLERANCE = -10;

var municipalities = [];

function loadMunicipalities(){
  var fs = require('fs');
  var obj = JSON.parse(fs.readFileSync('municipalities.json', 'utf8'));
  municipalities = obj.municipalities;
}


function validateMunicipalitiesSsl(){
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
      console.log(`${municipality.nombre}, Problems obtaining SSL status.`)
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
  console.log(municipality.nombre + " is UP!");
}

function isDown(municipality){
  console.log(municipality.nombre + " is DOWN!");
}

function sslValid(municipality,certificate){
  if(sslCertificateIsGoingToExpire(certificate)){
    console.log(`${municipality.nombre} SSL cert is valid. but is going to expire soon! (expire date: ${new Date(certificate.valid_to).format("DD/MM/YYYY")})`);
  } else {
    console.log(`${municipality.nombre} SSL cert is valid!`)
  }
}

function sslNotValid(municipality,certificate){
  console.log(`${municipality.nombre} SSL cert is EXPIRED! (expire date: ${new Date(certificate.valid_to).format("DD/MM/YYYY")})`);
}

loadMunicipalities();
validateMunicipalitiesSsl();
checkMunicipalities();
