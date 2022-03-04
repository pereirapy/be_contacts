exports.up = async function (knex) {
  await knex.schema.raw(`DROP VIEW "viewListContactsWaitingFeedback"`)

  return knex.schema.raw(`CREATE VIEW "viewListContactsWaitingFeedback" AS ?`, [
    knex
      .select(
        'detailsContacts.id',
        'detailsContacts.information',
        knex.raw(
          `to_char("detailsContacts"."createdAt",'yyyy-mm-dd') as "createdAt"`
        ),
        'detailsContacts.createdBy',
        'detailsContacts.idPublisher',
        'publisherCreatedBy.name as publisherNameCreatedBy',
        'publishers.name as publisherName',
        'languages.name as languageName',
        'status.description as statusDescription',
        'contacts.name as contactName',
        'contacts.gender',
        'contacts.note',
        'contacts.owner',
        'contacts.idStatus',
        'contacts.idLanguage',
        'contacts.phone',
        'contacts.typeCompany',
        'detailsContacts.createdAt as createdAtDetailsContacts',
        knex.raw('true as "waitingFeedback"')
      )
      .from('detailsContacts')
      .leftJoin(
        'contacts',
        'detailsContacts.phoneContact',
        '=',
        'contacts.phone'
      )
      .leftJoin(
        'publishers',
        'detailsContacts.idPublisher',
        '=',
        'publishers.id'
      )
      .leftJoin(
        'publishers as publisherCreatedBy',
        'detailsContacts.createdBy',
        '=',
        'publisherCreatedBy.id'
      )
      .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
      .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
      .where('detailsContacts.information', knex.raw(`'[WAITING_FEEDBACK]'`)),
  ])
}

exports.down = function (knex) {
  return knex.schema.raw(`DROP VIEW "viewListContactsWaitingFeedback"`)
}
