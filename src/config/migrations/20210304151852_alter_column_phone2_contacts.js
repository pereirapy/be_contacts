exports.up = async function (knex) {
  await knex.from('contacts').where({ phone2: '' }).update({ phone2: null })
  return knex.schema.alterTable('contacts', function (table) {
    table.string('phone2').nullable().unique().alter()
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('contacts', function (table) {
    table.string('phone2').nullable().alter()
  })
}
