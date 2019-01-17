var logger =  require('../../../../logger.js');

function listAll(onComplete){
  logger.debug('Getting instances using static file...');
  var fs = require('fs');
  const path = require("path");
  var obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, "instances.json"), 'utf8'));
  var instances = obj.instances;
  onComplete(instances);
}

module.exports = {
  listAll:listAll
}
