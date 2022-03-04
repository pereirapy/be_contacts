exports.up = async function (knex) {
  await knex.schema.raw(`DROP VIEW "viewListAllContacts"`)
  const sql = knex
    .select(
      'contacts.name',
      'contacts.owner',
      'contacts.phone',
      'contacts.idStatus',
      'contacts.idLanguage',
      'contacts.gender',
      'contacts.typeCompany',
      'contacts.idLocation',
      'cities.name as locationName',
      'departments.name as departmentName',
      'contacts.email',
      'contacts.note',
      'languages.name as languageName',
      'status.description as statusDescription',
      'dc.createdAt as createdAtDetailsContacts',
      knex.raw(
        `COALESCE(date_part('day'::text, now() - "dc"."updatedAt"),99999999999) as "lastConversationInDays"`
      ),
      'publishers.name as publisherName',
      knex.raw(
        `CASE 
          WHEN "dc"."information" = '[WAITING_FEEDBACK]' THEN true
          ELSE false
        END as "waitingFeedback"
        `
      ),
      'dc.information'
    )
    .from('contacts')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .leftJoin('cities', 'cities.id', '=', 'contacts.idLocation')
    .leftJoin('departments', 'departments.id', '=', 'cities.idDepartment')
    .leftJoin('detailsContacts as dc', function () {
      this.on('dc.phoneContact', '=', 'contacts.phone').on(
        'dc.isLast',
        '=',
        knex.raw('?', [true])
      )
    })
    .leftJoin('publishers', 'publishers.id', '=', 'dc.idPublisher')

  return knex.schema.raw(
    `CREATE OR REPLACE VIEW "viewListAllContacts" AS ${sql.toString()}`
  )
}

exports.down = async function (knex) {
  await knex.schema.raw(`DROP VIEW "viewListAllContacts"`)
  const sql = knex
    .select(
      'contacts.name',
      'contacts.owner',
      'contacts.phone',
      'contacts.idStatus',
      'contacts.idLanguage',
      'contacts.gender',
      'contacts.typeCompany',
      'contacts.idLocation',
      'cities.name as locationName',
      'departments.name as departmentName',
      'contacts.email',
      'contacts.note',
      'languages.name as languageName',
      'status.description as statusDescription',
      'dc.createdAt as createdAtDetailsContacts',
      knex.raw(
        `COALESCE(date_part('day'::text, now() - "dc"."createdAt"),99999999999) as "lastConversationInDays"`
      ),
      'publishers.name as publisherName',
      knex.raw(
        `CASE 
          WHEN "dc"."information" = '[WAITING_FEEDBACK]' THEN true
          ELSE false
        END as "waitingFeedback"
        `
      ),
      'dc.information'
    )
    .from('contacts')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .leftJoin('cities', 'cities.id', '=', 'contacts.idLocation')
    .leftJoin('departments', 'departments.id', '=', 'cities.idDepartment')
    .leftJoin('detailsContacts as dc', function () {
      this.on('dc.phoneContact', '=', 'contacts.phone').on(
        'dc.isLast',
        '=',
        knex.raw('?', [true])
      )
    })
    .leftJoin('publishers', 'publishers.id', '=', 'dc.idPublisher')

  return knex.schema.raw(
    `CREATE OR REPLACE VIEW "viewListAllContacts" AS ${sql.toString()}`
  )
}
