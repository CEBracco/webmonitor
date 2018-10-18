var SSL_WARNING_DAYS_TOLERANCE = -10;
var CHECK_INTERVAL = 1;
var CHECK_SSL_INTERVAL = 5;

var logger =  require('./logger.js');
var checker =  require('./core/checker.js');
var sslChecker =  require('./core/sslChecker.js');
var municipalities = [];

function loadMunicipalities(){
  var fs = require('fs');
  var obj = JSON.parse(fs.readFileSync('municipalities.json', 'utf8'));
  municipalities = obj.municipalities;
}

function isUp(municipality){
  // logger.info(municipality.nombre + " is UP!");
}

function isDown(municipality){
  logger.warn(municipality.nombre + " is DOWN!");
}

function sslValid(municipality,isNextToExpire,certificate){
  if(isNextToExpire){
    logger.info(`${municipality.nombre} SSL cert is valid. but is going to expire soon! (expire date: ${new Date(certificate.valid_to).format("DD/MM/YYYY")})`);
  } else {
    // logger.info(`${municipality.nombre} SSL cert is valid!`)
  }
}

function sslNotValid(municipality,certificate){
  logger.warn(`${municipality.nombre} SSL cert is EXPIRED! (expire date: ${new Date(certificate.valid_to).format("DD/MM/YYYY")})`);
}

loadMunicipalities();
sslChecker.execute(municipalities,CHECK_SSL_INTERVAL,SSL_WARNING_DAYS_TOLERANCE,sslValid,sslNotValid);
checker.execute(municipalities,CHECK_INTERVAL,isUp,isDown);
