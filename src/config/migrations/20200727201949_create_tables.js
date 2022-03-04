exports.up = function (knex) {
  return knex.schema
    .createTable('responsibility', function (table) {
      table.increments()
      table.string('description').notNullable().unique()
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
    })

    .createTable('publishers', function (table) {
      table.increments()
      table.string('name').notNullable()
      table.string('phone', 30).unique()
      table.string('password').nullable()
      table.string('hash').nullable()
      table.string('email').nullable().unique()
      table.integer('idResponsibility').defaultTo(1)
      table.boolean('active').notNullable().defaultTo(true)
      table.boolean('haveToReauthenticate').notNullable().defaultTo(false)
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()
      table.foreign('createdBy').references('id').inTable('publishers')
      table.foreign('updatedBy').references('id').inTable('publishers')

      table
        .foreign('idResponsibility')
        .references('id')
        .inTable('responsibility')

      table.index(['phone', 'name', 'email', 'idResponsibility'])
    })

    .createTable('status', function (table) {
      table.increments()
      table.string('description').notNullable().unique()
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()

      table.foreign('createdBy').references('id').inTable('publishers')
      table.foreign('updatedBy').references('id').inTable('publishers')
    })
    .createTable('languages', function (table) {
      table.increments()
      table.string('name').notNullable().unique()
      table.string('color', 10).unique().notNullable()
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()

      table.foreign('createdBy').references('id').inTable('publishers')
      table.foreign('updatedBy').references('id').inTable('publishers')
    })

    .createTable('contacts', function (table) {
      table.string('phone').notNullable().primary()
      table.string('location').nullable()
      table.string('phone2').nullable()
      table.string('name').nullable()
      table.text('note').nullable()
      table.string('email').nullable().unique()
      table.boolean('typeCompany').notNullable().defaultTo(false)
      table.string('gender', 7).notNullable().defaultTo('unknown')
      table.integer('idStatus').notNullable().defaultTo(1)
      table.integer('idLanguage').notNullable().defaultTo(5)
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
      table.foreign('createdBy').references('id').inTable('publishers')
      table.foreign('updatedBy').references('id').inTable('publishers')

      table.foreign('idLanguage').references('id').inTable('languages')
      table.foreign('idStatus').references('id').inTable('status')

      table.index(['name', 'gender', 'idStatus', 'idLanguage', 'typeCompany'])
    })
    .createTable('detailsContacts', function (table) {
      table.increments()
      table.text('information').notNullable()
      table.integer('idPublisher').notNullable()
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()
      table.string('phoneContact').notNullable()

      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())

      table.foreign('createdBy').references('id').inTable('publishers')
      table.foreign('updatedBy').references('id').inTable('publishers')
      table.foreign('idPublisher').references('id').inTable('publishers')

      table.foreign('phoneContact').references('phone').inTable('contacts')

      table.index(['idPublisher', 'phoneContact', 'createdAt', 'createdBy'])
    })

    .createTable('permissions', function (table) {
      table.increments()
      table.string('method').notNullable()
      table.string('page').notNullable()
      table.integer('idMinimumResponsibilityRequired').notNullable()
      table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()

      table.foreign('createdBy').references('id').inTable('publishers')
      table.foreign('updatedBy').references('id').inTable('publishers')

      table
        .foreign('idMinimumResponsibilityRequired')
        .references('id')
        .inTable('responsibility')
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTable('detailsContacts')
    .dropTable('contacts')
    .dropTable('status')
    .dropTable('languages')
    .dropTable('permissions')
    .dropTable('publishers')
    .dropTable('responsibility')
}
