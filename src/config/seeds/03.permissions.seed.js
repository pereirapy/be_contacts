const data = require('./permissions.json')
const table = 'permissions'

exports.seed = async function (knex) {
  await knex(table).del()
  await knex.raw(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1`)
  return knex(table).insert(data)
}
