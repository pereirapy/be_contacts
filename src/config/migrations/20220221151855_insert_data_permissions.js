exports.up = async function (knex) {
  return knex('permissions') //migration moved to seed
}

exports.down = function (knex) {
  return knex('permissions')
}
