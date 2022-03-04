exports.up = function (knex) {
  return knex.schema
  .createTable('campaigns', function (table) {
    table.increments()
    table.string('name').notNullable().unique()
    table.date('dateStart').notNullable()
    table.date('dateFinal').notNullable()
    table.integer('createdBy').notNullable()
    table.integer('updatedBy').nullable()
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updatedAt').nullable()
    table.foreign('createdBy').references('id').inTable('publishers')
    table.foreign('updatedBy').references('id').inTable('publishers')


  })

  .alterTable('detailsContacts', function (table) {
    table.integer('idCampaign').nullable()
    table.foreign('idCampaign').references('id').inTable('campaigns')

  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('detailsContacts', function (table) {
    table.dropColumn('idCampaign')
  })
  .dropTable('campaigns')

}
