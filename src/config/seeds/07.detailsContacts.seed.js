const data = require('./detailsContacts.json')
const table = 'detailsContacts'

exports.seed = async function (knex) {
  await knex(table).del()
  return knex(table).insert(data)
}
