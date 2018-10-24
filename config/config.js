var repository = require(`./repository/${process.env.CONFIG_REPOSITORY}Repository.js`);

function get(key){
  return repository.get(key);
}

module.exports = {
  get:get
}
