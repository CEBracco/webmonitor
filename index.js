var _ = require('lodash');
var logger =  require('./logger.js');
var checker =  require('./core/checker.js');
var sslChecker =  require('./core/sslChecker.js');
var instanceRepository = require('./repository/instance/instanceRepository.js');
var municipalities = [];
var actuallyDown = require('./utils/downSet.js');
var alertBroker = require('./alert/alertBroker.js');
var server = require('./web/server.js');
const humanizeDuration = require('humanize-duration');

function sslValid(municipality,isNextToExpire,certificate){
  if(isNextToExpire){
    logger.info(`${municipality.nombre} SSL cert is valid. but is going to expire soon! (expire date: ${new Date(certificate.valid_to).format("DD/MM/YYYY")})`);
    alertBroker.sendSslGoingToExpireAlert(municipality,certificate);
  } else {
    // logger.info(`${municipality.nombre} SSL cert is valid!`)
  }
}

function sslNotValid(municipality,certificate){
  logger.warn(`${municipality.nombre} SSL cert is EXPIRED! (expire date: ${new Date(certificate.valid_to).format("DD/MM/YYYY")})`);
  alertBroker.sendSslNotValidAlert(municipality);
}

function isUp(municipality){
  if(actuallyDown.contains(municipality)){
    var log = actuallyDown.getLog(municipality);
    logger.info(`${municipality.nombre} is back UP!, it was down for ${humanizeDuration(new Date() - log.date, { round: true })}`);
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

function startApp(){
  server.start();
  sslChecker.execute(municipalities,sslValid,sslNotValid);
  checker.execute(municipalities,isUp,isDown);
}

instanceRepository.listAll(function(instances) {
  municipalities=instances;
  logger.info(`Instances fetched, proceeding to check: ${_.map(_.filter(municipalities, {'habilitado': true }), 'nombre').sort().join(', ')}`);
  startApp();
})
