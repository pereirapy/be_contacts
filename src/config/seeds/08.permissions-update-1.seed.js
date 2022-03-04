const data = require('./permissions-update-1.json')
const table = 'permissions'

exports.seed = async function (knex) {
  return knex(table).insert(data)
}
