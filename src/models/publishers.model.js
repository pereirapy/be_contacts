import crud from './crudGeneric.model'
import knex from '../config/connection'

import { map, omit, curry, isEmpty } from 'lodash/fp'
import asyncPipe from 'pipeawait'

const tableName = 'publishers'
const columnPrimary = 'id'
const omitColumns = ['password', 'haveToReauthenticate', 'hash']

const getAllWithPagination = async queryParams => {
  const { sort = 'name:ASC', perPage, currentPage, filters } = queryParams
  const sql = knex
    .select(
      'publishers.id',
      'publishers.name',
      'publishers.phone',
      'publishers.email',
      'publishers.idResponsibility',
      'publishers.active',
      'responsibility.description as responsibilityDescription '
    )
    .from(tableName)
    .leftJoin(
      'responsibility',
      'publishers.idResponsibility',
      '=',
      'responsibility.id'
    )

  if (!isEmpty(filters)) {
    const { name, phone, email, responsibility } = JSON.parse(filters)

    if (!isEmpty(name) && !isEmpty(phone)) {
      sql.where(builder =>
        builder
          .where('publishers.name', 'ilike', `%${name}%`)
          .orWhere('publishers.phone', 'ilike', `%${phone}%`)
          .orWhere('publishers.email', 'ilike', `%${email}%`)
      )
    }
    if (!isEmpty(responsibility))
      sql.andWhere(qB =>
        qB.whereIn('publishers.idResponsibility', responsibility)
      )
  }
  return await sql
    .orderByRaw(crud.parseOrderBy(sort))
    .paginate(perPage, currentPage)
}

const getResponsibility = async () =>
  knex
    .select(
      'idResponsibility',
      'responsibility.description as responsibilityDescription'
    )
    .from(tableName)
    .leftJoin(
      'responsibility',
      'responsibility.id',
      '=',
      'publishers.idResponsibility'
    )
    .groupBy('idResponsibility', 'responsibility.description')

const getFilters = async () => {
  const responsibility = await getResponsibility()
  return { responsibility }
}

const removeColumnNotAllowed = data => map(pub => omit(omitColumns, pub), data)

const getAll = async queryParams =>
  await asyncPipe(
    curry(crud.getAll)(tableName),
    removeColumnNotAllowed
  )(queryParams)

const getAllPublishersActives = async queryParams => {
  const { sort } = queryParams

  return asyncPipe(
    crud.getAllWithWhere,
    removeColumnNotAllowed
  )({ sort, tableName, where: { active: true } })
}

const getOneRecord = async id =>
  crud.getOneRecord({ id, tableName, columnPrimary })

const getRecordForAuth = async (id, column) =>
  crud.getOneRecord({ id, tableName, columnPrimary: column })

const createRecord = async data =>
  await asyncPipe(
    curry(crud.createRecord)(data),
    removeColumnNotAllowed
  )(tableName)

const updateRecord = async ({ id, data }) =>
  await asyncPipe(crud.updateRecord, data => ({
    ...data,
    data: removeColumnNotAllowed(data.data)
  }))({ id, data, tableName, columnPrimary })

const deleteRecord = async id =>
  crud.deleteRecord({ id, tableName, columnPrimary })

export {
  getAllWithPagination,
  getAll,
  getAllPublishersActives,
  getFilters,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordForAuth,
  omitColumns
}
