/* eslint-disable @typescript-eslint/camelcase */
import {
  getUserPermission,
  getOneWithWhere,
  getAll,
  createRecord,
  updateRecord,
  deleteRecord,
  putFields
} from '../models/permissions.model'
import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery
} from '../shared/helpers/generic.helper'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import asyncPipe from 'pipeawait'
import { curry, get as getLodash, pick } from 'lodash/fp'
import { NOT_ALLOWED_DELETE } from '../shared/constants/permissions.constant'
import { getRecordForAuth } from '../models/publishers.model'
import { ADMIN } from '../shared/constants/permissions.constant'
import {
  NO_PERMISSION_ENOUGH,
  HAVE_TO_REAUTHENTICATE
} from '../shared/constants/security.constant'

const hasPermission = async (userIdResponsibility, page, method) => {
  const { idMinimumResponsibilityRequired } = await getUserPermission(
    page,
    method
  )
  return userIdResponsibility >= idMinimumResponsibilityRequired
}

const haveToReAuthenticate = async userId => {
  const { haveToReauthenticate } = await getRecordForAuth(userId, 'id')
  return Boolean(haveToReauthenticate)
}

const checkPermissions = async req => {
  const { user, query, method, baseUrl } = req
  const page = baseUrl.slice(1)
  const reAuthenticate = await haveToReAuthenticate(user.id)
  const userCanAccess = await hasPermission(
    user.idResponsibility,
    query.page || page,
    method
  )
  const codMessage = reAuthenticate
    ? HAVE_TO_REAUTHENTICATE
    : NO_PERMISSION_ENOUGH
  if (user.idResponsibility !== ADMIN && (reAuthenticate || !userCanAccess)) {
    throw codMessage
  }
}

const get = async request => {
  const paramsQuery = defaultValueForQuery(request, {
    sort: 'page:asc'
  })
  return asyncPipe(getAll, curry(responseSuccess)(request))(paramsQuery)
}

const create = async request =>
  asyncPipe(
    createRecord,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const filterWhatCanUpdate = obj => ({
  ...obj,
  data: pick(putFields, getLodash('data', obj))
})

const update = async request =>
  asyncPipe(
    filterWhatCanUpdate,
    updateRecord,
    curry(responseSuccess)(request)
  )(getParamsForUpdate(request))

const verifyIfCanDelete = async id => {
  const permissionWantDelete = await getOneWithWhere({ id })
  if (getLodash('page', permissionWantDelete) === 'permissions') {
    throw NOT_ALLOWED_DELETE
  }
  return id
}

const deleteOne = async request =>
  asyncPipe(
    verifyIfCanDelete,
    deleteRecord,
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

export default {
  hasPermission,
  get,
  create,
  update,
  deleteOne,
  haveToReAuthenticate,
  checkPermissions
}
