import knex from '../config/connection'
import { getOr } from 'lodash/fp'
import crud from './crudGeneric.model'

const tableName = 'responsibility'
const columnPrimary = 'id'
const fields = ['description']

const getAllAllowedForMe = async (queryParams) =>
  knex
    .select()
    .from(tableName)
    .where(columnPrimary, '<=', getOr(0, 'user.idResponsibility', queryParams))
    .orderBy(columnPrimary)

const getAll = async (queryParams) => crud.getAll(tableName, queryParams)

export { getAllAllowedForMe, fields, getAll }
