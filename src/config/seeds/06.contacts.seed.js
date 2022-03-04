const data = require('./contacts.json')
const table = 'contacts'

exports.seed = async function (knex) {
  await knex(table).del()
  return knex(table).insert(data)
}
