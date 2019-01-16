var _ = require('lodash');
var logger =  require('../../logger.js');
var config = require('../../config/config.js');
var providers = [];
var successFunction;

for (provider of config.get('INSTANCE_PROVIDERS').split(',')) {
   providers.push(require(`./providers/${provider}Provider/${provider}Provider.js`));
}

function listAll(onComplete) {
  successFunction = onComplete;
  getFromProviderIndex(0,[]);
}

function getFromProviderIndex(index,instances){
  if(index >= providers.length){
    successFunction(instances);
  } else {
    providers[index].listAll(function(i){
      getFromProviderIndex(index+1,_.concat(instances,i));
    })
  }
  
}
  
module.exports = {
  listAll:listAll
}
