exports.up = function(knex) {
  return knex('contacts')
    .update('idLocation', 24)
    .whereNull('idLocation')
}

exports.down = function(knex) {
  return knex('contacts')
    .update('idLocation', null)
    .where('idLocation', 24)
}
