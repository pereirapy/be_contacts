const crypto = require('crypto')
const table = 'publishers'

exports.seed = async function (knex) {
  const data = [
    {
      id: 1,
      name: 'Admin',
      phone: null,
      password: crypto.createHmac('sha256', '123456').digest('hex'),
      email: 'admin@example.com',
      idResponsibility: 4,
      createdBy: 1,
      active: true,
      createdAt: '2020-08-31T13:59:35.232Z',
    },
  ]
  await knex(table).del()
  await knex.raw(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 2`)
  return knex(table).insert(data)
}
