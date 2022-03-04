exports.up = async function (knex) {
  return knex('permissions').insert([
    {
      method: 'get',
      page: 'campaigns',
      idMinimumResponsibilityRequired: '1',
      createdBy: '1',
    },
    {
      method: 'post',
      page: 'campaigns',
      idMinimumResponsibilityRequired: '2',
      createdBy: '1',
    },
    {
      method: 'put',
      page: 'campaigns',
      idMinimumResponsibilityRequired: '2',
      createdBy: '1',
    },
    {
      method: 'delete',
      page: 'campaigns',
      idMinimumResponsibilityRequired: '2',
      createdBy: '1',
    },
  ])
}

exports.down = function (knex) {
  return knex('permissions').where('page', 'campaigns').del()
}
