const knex = require('./src/config/connection')

module.exports = async () => {
  await knex.destroy()
}
