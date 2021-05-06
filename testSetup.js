const knex = require('./src/config/connection')
const knexCleaner = require('knex-cleaner')

module.exports = async () => {
  await knexCleaner.clean(knex, {
    ignoreTables: ['knex_migrations']
  })
  await knex.migrate.latest()
  await knex.seed.run()
}
