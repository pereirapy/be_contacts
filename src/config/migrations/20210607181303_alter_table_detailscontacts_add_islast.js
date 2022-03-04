exports.up = async function (knex) {
  await knex.schema.alterTable('detailsContacts', function (table) {
    table.boolean('isLast').defaultTo(false)
  })

  return knex.raw(
    `update 
    "detailsContacts" 
  set 
    "isLast" = true 
  where 
    "detailsContacts"."id" in (
      select 
        "dc"."id" 
      from 
        "contacts" as "c" 
        left join "detailsContacts" as "dc" on "dc"."phoneContact" = "c"."phone" 
        and "dc"."id" = (
          select 
            max("dc2"."id") 
          from 
            "detailsContacts" as "dc2" 
          where 
            "dc2"."phoneContact" = c.phone
        ) 
      where 
        "dc"."information" is not null
    )
  `
  )
}

exports.down = function (knex) {
  return knex.schema.alterTable('detailsContacts', function (table) {
    table.dropColumn('isLast')
  })
}
