var _ = require('lodash');
var logger =  require('./logger.js');
var checker =  require('./core/checker.js');
var sslChecker =  require('./core/sslChecker.js');
var instanceRepository = require('./repository/instance/instanceRepository.js');
global.municipalities = [];
global.actuallyDown = require('./utils/downSet.js');
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
  if(global.actuallyDown.contains(municipality)){
    var log = global.actuallyDown.getLog(municipality);
    logger.info(`${municipality.nombre} is back UP!, it was down for ${humanizeDuration(new Date() - log.date, { round: true })}`);
    alertBroker.sendUpAlert(global.actuallyDown.getLog(municipality));
    global.actuallyDown.remove(municipality);
  }
}

function isDown(municipality){
  logger.warn(municipality.nombre + " is DOWN!");
  if(!global.actuallyDown.contains(municipality)){
    global.actuallyDown.put(municipality);
    alertBroker.sendDownAlert(global.actuallyDown.getLog(municipality));
  }
}

function startApp(){
  server.start();
  sslChecker.execute(global.municipalities,sslValid,sslNotValid);
  checker.execute(global.municipalities,isUp,isDown);
}

instanceRepository.listAll(function(instances) {
  global.municipalities=instances;
  logger.info(`Instances fetched, proceeding to check: ${_.map(global.municipalities, 'nombre').sort().join(', ')}`);
  startApp();
})
