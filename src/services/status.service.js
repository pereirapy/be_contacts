const {
  getAll,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../models/status.model')
import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery,
} from '../shared/helpers/generic.helper'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import asyncPipe from 'pipeawait'
import { curry } from 'lodash/fp'

const get = async (request) => {
  const paramsQuery = defaultValueForQuery(request, {
    sort: 'description:asc',
  })
  return asyncPipe(getAll, curry(responseSuccess)(request))(paramsQuery)
}

const create = async (request) =>
  asyncPipe(
    createRecord,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const update = async (request) =>
  asyncPipe(
    updateRecord,
    curry(responseSuccess)(request)
  )(getParamsForUpdate(request))

const deleteOne = async (request) =>
  asyncPipe(
    deleteRecord,
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

export default { get, create, update, deleteOne }
