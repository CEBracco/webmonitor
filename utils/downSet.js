var _ = require('lodash');
var downInstances = [];

function put(municipality){
  if(!contains(municipality)){
    downInstances.push({instance:municipality, date: new Date()});
  }
}

function remove(municipality){
  _.remove(downInstances, function(downLog){
    return downLog.instance.nombre == municipality.nombre;
  });
}

function getLog(municipality){
    return _.find(downInstances, function(downLog){
      return downLog.instance.nombre == municipality.nombre;
    });
}

function contains(municipality){
  return _.some(downInstances, function(downLog){
    return downLog.instance.nombre == municipality.nombre;
  });
}

module.exports = {
  put:put,
  remove:remove,
  contains:contains,
  getLog:getLog
}
