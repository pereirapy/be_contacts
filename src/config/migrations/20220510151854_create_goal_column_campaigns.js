exports.up = async function (knex) {
  await knex.schema.alterTable('campaigns', function (table) {
    table.string('goal').nullable()
  })

  await knex('campaigns').update('goal', 'Atualize aqui o alvo desta campanha')

  return knex.schema.alterTable('campaigns', function (table) {
    table.string('goal').notNullable().alter()
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('campaigns', function (table) {
    table.dropColumn('goal')
  })
}
