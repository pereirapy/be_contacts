exports.up = async function (knex) {
  await knex.schema.alterTable('contacts', function (table) {
    table.dateTime('updatedAt').nullable()
  })

  return knex.raw(
    `update 
    "contacts" 
  set 
    "updatedAt" =  "createdAt"
  
  `
  )
}

exports.down = function (knex) {
  return knex.schema.alterTable('contacts', function (table) {
    table.dropColumn('updatedAt')
  })
}
