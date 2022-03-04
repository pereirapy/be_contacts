import knex from '../config/connection'
import crud from './crudGeneric.model'

const tableName = 'cities'
const columnPrimary = 'id'
const fields = ['name']

const getAll = async (queryParams) => {
  const { sort = `${tableName}.name:ASC` } = queryParams
  return knex
    .select(
      `${tableName}.${columnPrimary} AS value`,
      knex.raw(`CONCAT(${tableName}.name,' - ', departments.name) as label`)
    )
    .from(tableName)
    .leftJoin('departments', 'departments.id', '=', `${tableName}.idDepartment`)
    .orderByRaw(crud.parseOrderBy(sort))
}

export { getAll, fields }
