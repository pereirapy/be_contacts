const crypto = require('crypto')
const dataResponsibility = require('../seeds/responsibility.json')
const dataPermissions = require('../seeds/permissions.json')
const dataStatus = require('../seeds/status.json')
const dataLanguages = require('../seeds/languages.json')

const dataPublishers = [
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

async function responsibility(knex) {
  await knex.raw(
    `ALTER SEQUENCE responsibility_id_seq RESTART WITH ${
      dataResponsibility.length + 1
    }`
  )
  return knex('responsibility').insert(dataResponsibility)
}

async function publishers(knex) {
  await knex.raw(`ALTER SEQUENCE publishers_id_seq RESTART WITH 2`)

  return knex('publishers').insert(dataPublishers)
}

async function permissions(knex) {
  await knex.raw(`ALTER SEQUENCE permissions_id_seq RESTART WITH 1`)

  return knex('permissions').insert(dataPermissions)
}

async function status(knex) {
  await knex.raw(
    `ALTER SEQUENCE status_id_seq RESTART WITH ${dataStatus.length + 1}`
  )

  return knex('status').insert(dataStatus)
}

async function languages(knex) {
  await knex.raw(
    `ALTER SEQUENCE languages_id_seq RESTART WITH ${dataLanguages.length + 1}`
  )
  return knex('languages').insert(dataLanguages)
}

exports.up = async function (knex) {
  await responsibility(knex)
  await publishers(knex)
  await permissions(knex)
  await status(knex)
  return languages(knex)
}

exports.down = async function (knex) {
  await knex('responsibility').del()
  await knex('publishers').del()
  await knex('permissions').del()
  await knex('status').del()
  return knex('languages').del()
}
