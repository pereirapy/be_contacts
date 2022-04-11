exports.up = async function (knex) {
  await knex.schema.alterTable('detailsContacts', function (table) {
    table.boolean('goalReached').notNullable().defaultTo(false)
  })

  return knex('detailsContacts').update('goalReached', true).where('information', '!=', '[WAITING_FEEDBACK]')
}

exports.down = function (knex) {
  return knex.schema.alterTable('detailsContacts', function (table) {
    table.dropColumn('goalReached')
  })
}
