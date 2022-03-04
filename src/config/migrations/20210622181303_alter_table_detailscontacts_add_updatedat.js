exports.up = async function (knex) {
  await knex.schema.alterTable('detailsContacts', function (table) {
    table.dateTime('updatedAt').nullable()
  })

  return knex.raw(
    `update 
    "detailsContacts" 
  set 
    "updatedAt" =  "createdAt"
  
  `
  )
}

exports.down = function (knex) {
  return knex.schema.alterTable('detailsContacts', function (table) {
    table.dropColumn('updatedAt')
  })
}
