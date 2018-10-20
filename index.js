var SSL_WARNING_DAYS_TOLERANCE = -10;
var CHECK_INTERVAL = 1;
var CHECK_SSL_INTERVAL = 5;

var logger =  require('./logger.js');
var checker =  require('./core/checker.js');
var sslChecker =  require('./core/sslChecker.js');
var municipalities = [];
var actuallyDown = require('./utils/downSet.js');
var alertBroker = require('./alert/alertBroker.js');
const humanizeDuration = require('humanize-duration');

function loadMunicipalities(){
  var fs = require('fs');
  var obj = JSON.parse(fs.readFileSync('municipalities.json', 'utf8'));
  municipalities = obj.municipalities;
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

function isUp(municipality){
  if(actuallyDown.contains(municipality)){
    var log = actuallyDown.getLog(municipality);
    logger.info(`${municipality.nombre} is back UP!, it was down for ${humanizeDuration(new Date() - log.date)}`);
    alertBroker.sendUpAlert(actuallyDown.getLog(municipality));
    actuallyDown.remove(municipality);
  }
}

function isDown(municipality){
  logger.warn(municipality.nombre + " is DOWN!");
  if(!actuallyDown.contains(municipality)){
    actuallyDown.put(municipality);
    alertBroker.sendDownAlert(actuallyDown.getLog(municipality));
  }  
}

loadMunicipalities();
sslChecker.execute(municipalities,CHECK_SSL_INTERVAL,SSL_WARNING_DAYS_TOLERANCE,sslValid,sslNotValid);
checker.execute(municipalities,CHECK_INTERVAL,isUp,isDown);
