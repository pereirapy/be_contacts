exports.up = async function (knex) {
  return knex('responsibility').update('description', 'ministerialServant').where('id', 2) 
}

exports.down = function (knex) {
  return knex('responsibility').update('description', 'ministerial servant').where('id', 2) 
}
