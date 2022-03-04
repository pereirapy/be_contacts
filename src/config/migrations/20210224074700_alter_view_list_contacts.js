exports.up = function (knex) {
  return knex.schema.raw(`CREATE OR REPLACE VIEW "viewListContacts" AS ?`, [
    knex
      .select(
        'contacts.name',
        'contacts.owner',
        'contacts.phone',
        'contacts.idStatus',
        'contacts.idLanguage',
        'contacts.gender',
        'contacts.typeCompany',
        'contacts.location',
        'contacts.email',
        'contacts.note',
        'languages.name as languageName',
        'status.description as statusDescription',
        'dc.createdAtDetailsContacts',
        knex.raw(
          'COALESCE(dc."lastConversationInDays",99999999999) as "lastConversationInDays"'
        ),
        'dc.publisherName'
      )
      .from('contacts')
      .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
      .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
      .joinRaw(
        `LEFT JOIN lateral (
        SELECT 
          "phoneContact", 
          "publishers"."name" as "publisherName", 
          "detailsContacts"."createdAt" as "createdAtDetailsContacts", 
          DATE_PART('day', now() - "detailsContacts"."createdAt") as "lastConversationInDays"
        FROM "detailsContacts"
        LEFT JOIN publishers on publishers.id = "detailsContacts"."idPublisher"
        WHERE "detailsContacts"."phoneContact" = contacts.phone
        ORDER BY "detailsContacts"."createdAt" DESC
        LIMIT 1) as dc ON contacts.phone = dc."phoneContact"`
      )
      .orderBy('contacts.phone'),
  ])
}

exports.down = function (knex) {
  return knex.schema.raw(`DROP VIEW "viewListContacts"`)
}
