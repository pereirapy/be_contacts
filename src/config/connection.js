/* eslint-disable security/detect-object-injection */
const setupKnexPaginator = require('./knexPaginator')
const env = process.env.NODE_ENV || 'development'
const knexfile = require('./knexfile')
const knex = require('knex')(knexfile[env])
setupKnexPaginator(knex)
module.exports = knex
