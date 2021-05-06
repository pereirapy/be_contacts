const data = require('./responsibility.json')
const table = 'responsibility'

exports.seed = async function(knex) {
  await knex(table).del()
  await knex.raw(
    `ALTER SEQUENCE ${table}_id_seq RESTART WITH ${data.length + 1}`
  )
  return knex(table).insert(data)
}
