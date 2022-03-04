exports.up = function (knex) {
  return knex.schema.alterTable('contacts', function (table) {
    table.string('owner').nullable()
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('contacts', function (table) {
    table.dropColumn('owner')
  })
}
