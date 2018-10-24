var repository = require(`./repository/${process.env.CONFIG_REPOSITORY}Repository.js`);

function get(key){
  return repository.get(key);
}

function getBoolean(key){
  return repository.getBoolean(key);
}

module.exports = {
  get:get,
  getBoolean:getBoolean
}
