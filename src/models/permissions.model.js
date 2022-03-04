import crud from './crudGeneric.model'
import { toLower } from 'lodash/fp'

const tableName = 'permissions'
const columnPrimary = 'id'
const fields = ['method', 'page', 'idMinimumResponsibilityRequired']
const putFields = ['idMinimumResponsibilityRequired']

const getUserPermission = async (page, method) =>
  crud.getOneWithWhere({
    tableName,
    where: { page: toLower(page), method: toLower(method) },
  })

const getAll = async (queryParams) => crud.getAll(tableName, queryParams)

const getOneWithWhere = async (where) => crud.getOneWithWhere(tableName, where)

const createRecord = async (data) => crud.createRecord(data, tableName)

const updateRecord = async ({ id, data }) =>
  crud.updateRecord({ id, data, tableName, columnPrimary })

const deleteRecord = async (id) =>
  crud.deleteRecord({ id, tableName, columnPrimary })

export {
  getUserPermission,
  getOneWithWhere,
  getAll,
  createRecord,
  updateRecord,
  deleteRecord,
  fields,
  putFields,
}
