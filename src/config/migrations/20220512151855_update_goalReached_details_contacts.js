exports.up = function (knex) {
  return knex('detailsContacts')
    .update('goalReached', false)
    .where('information', '!=', '[WAITING_FEEDBACK]')
    .andWhere('createdAt', '<', '2022-02-20')
}

exports.down = function (knex) {
  return knex('detailsContacts')
    .update('goalReached', true)
    .where('information', '!=', '[WAITING_FEEDBACK]')
    .andWhere('createdAt', '<', '2022-02-20')
}
