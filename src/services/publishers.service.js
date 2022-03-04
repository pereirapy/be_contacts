const {
  getAllWithPagination,
  getAll,
  getAllPublishersActives,
  getFilters,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  omitColumns,
} = require('../models/publishers.model')
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForGet,
  getParamsForDelete,
  defaultValueForQuery,
} from '../shared/helpers/generic.helper'
import asyncPipe from 'pipeawait'
import {
  curry,
  get as getLodash,
  omit,
  toInteger,
  getOr,
  isEmpty,
} from 'lodash/fp'
import {
  NOT_ALLOWED_DELETE_ADMIN,
  NOT_ALLOWED_EDIT_DATA_MORE_RESPONSIBILITY,
} from '../shared/constants/security.constant'
import { encrypt } from '../shared/helpers/generic.helper'
import HttpStatus from 'http-status-codes'

import {
  ID_ADMIN,
  ERROR_PASSWORD_LOWERCASE_LETTER,
  ERROR_PASSWORD_UPPERCASE_LETTER,
  ERROR_PASSWORD_NUMBER,
  ERROR_PASSWORD_SPECIAL_CHARACTER,
  ERROR_PASSWORD_MINIMUM_LENGTH,
  ERROR_PASSWORD_SPACE,
} from '../shared/constants/publishers.constant'

const getAllInformationWithPagination = async (request) => {
  const paramsQuery = {
    ...defaultValueForQuery(request, {
      sort: 'name:asc',
    }),
    user: getLodash('user', request),
  }
  return asyncPipe(
    getAllWithPagination,
    curry(responseSuccess)(request)
  )(paramsQuery)
}

const get = async (request) => {
  const paramsQuery = {
    ...defaultValueForQuery(request, {
      sort: 'name:asc',
    }),
    user: getLodash('user', request),
  }
  return asyncPipe(getAll, curry(responseSuccess)(request))(paramsQuery)
}

const getAllActives = async (request) => {
  const paramsQuery = {
    ...defaultValueForQuery(request, {
      sort: 'name:asc',
    }),
    user: getLodash('user', request),
  }
  return asyncPipe(
    getAllPublishersActives,
    curry(responseSuccess)(request)
  )(paramsQuery)
}

const verifyIfCurrentUserCanEditThisData = (obj) => {
  if (currentUserHasMinusReponsibilityThatDataPublisher(obj))
    throw NOT_ALLOWED_EDIT_DATA_MORE_RESPONSIBILITY

  return obj
}

const currentUserHasMinusReponsibilityThatDataPublisher = (obj) =>
  toInteger(getLodash('idResponsibility', obj)) <
  toInteger(getLodash('data.idResponsibility', obj))

const prepareDataToVerification = (request, data) => ({
  ...data,
  idResponsibility: getLodash('user.idResponsibility', request),
})

const appendDisabledFields = (request, obj) => ({
  ...obj,
  disabled: currentUserHasMinusReponsibilityThatDataPublisher(
    prepareDataToVerification(request, { data: obj })
  ),
})

const getOne = async (request) =>
  asyncPipe(
    getOneRecord,
    curry(appendDisabledFields)(request),
    omit(omitColumns),
    curry(responseSuccess)(request)
  )(getParamsForGetOne(request))

const create = async (request) =>
  asyncPipe(
    validatePassword,
    encryptPassword,
    createRecord,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const verifyWhatCanUpdate = (obj) =>
  toInteger(getLodash('id', obj)) === 99999
    ? {
        ...obj,
        data: omit(['idResponsibility'], getLodash('data', obj)),
      }
    : obj

const setValueReAuthenticate = async (id, value) =>
  Boolean(await updateRecord({ id, data: { haveToReauthenticate: value } }))

const reBuildObjectDataToReauthenticate = (obj) => ({
  id: getLodash('id', obj),
  data: {
    ...getLodash('data', obj),
    haveToReauthenticate: true,
  },
})

const verifyIfIsNecessaryReAuthenticate = async (obj) =>
  getLodash('data.idResponsibility', obj) &&
  toInteger(getLodash('data.idResponsibility', obj)) !==
    toInteger(
      getLodash('idResponsibility', await getOneRecord(getLodash('id', obj)))
    )
    ? reBuildObjectDataToReauthenticate(obj)
    : obj

const update = async (request) => {
  return asyncPipe(
    verifyWhatCanUpdate,
    verifyIfIsNecessaryReAuthenticate,
    curry(prepareDataToVerification)(request),
    verifyIfCurrentUserCanEditThisData,
    validatePassword,
    encryptPassword,
    updateRecord,
    curry(responseSuccess)(request)
  )(getParamsForUpdate(request))
}
const verifyIfCanDelete = (id) => {
  if (toInteger(id) === ID_ADMIN) {
    throw NOT_ALLOWED_DELETE_ADMIN
  }
  return id
}

const deleteOne = async (request) =>
  asyncPipe(
    verifyIfCanDelete,
    deleteRecord,
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

const mountDataWithPasswordForEdit = (obj, password) => ({
  ...obj,
  data: {
    ...obj.data,
    password,
  },
})

const mountDataWithoutPasswordForEdit = (obj) => ({
  ...obj,
  data: {
    ...omit(['password'], obj.data),
  },
})

const mountDataWithPasswordForNew = (data, password) => ({
  ...data,
  password,
})

const encryptPassword = (obj) => {
  const password = getOr(getLodash('data.password', obj), 'password', obj)
  const modeEdit = Boolean(getLodash('data.id', obj))

  if (!isEmpty(password)) {
    return modeEdit
      ? mountDataWithPasswordForEdit(obj, encrypt(password))
      : mountDataWithPasswordForNew(obj, encrypt(password))
  }

  return modeEdit
    ? mountDataWithoutPasswordForEdit(obj)
    : omit(['password'], obj)
}

const validatePassword = (data) => {
  const password = getOr(getLodash('data.password', data), 'password', data)

  const passwordRequirements = [
    {
      regex: /.{8,}/, //  deve ter pelo menos 8 chars,
      message: ERROR_PASSWORD_MINIMUM_LENGTH,
    },
    {
      regex: /[a-z]/, // deve ter pelo menos uma letra minuscula
      message: ERROR_PASSWORD_LOWERCASE_LETTER,
    },
    {
      regex: /[A-Z]/, // deve ter pelo menos uma letra maiuscula
      message: ERROR_PASSWORD_UPPERCASE_LETTER,
    },
    {
      regex: /[0-9]/, // deve ter pelo menos um numero
      message: ERROR_PASSWORD_NUMBER,
    },
    {
      regex: /[^A-Za-z0-9]/, // deve ter pelo menos um caractere especial
      message: ERROR_PASSWORD_SPECIAL_CHARACTER,
    },
    {
      regex: /^\S*$/, // must not contain spaces
      message: ERROR_PASSWORD_SPACE,
    },
  ]
  password &&
    passwordRequirements.forEach((it) => {
      if (!it.regex.test(String(password))) {
        throw {
          httpErrorCode: HttpStatus.BAD_REQUEST,
          error: it.message,
          extra: password,
        }
      }
    })

  return data
}

const getAllFiltersOfPublishers = async (request) =>
  asyncPipe(
    getFilters,
    curry(responseSuccess)(request)
  )(getParamsForGet(request))

export default {
  getAllInformationWithPagination,
  getAllFiltersOfPublishers,
  getAllActives,
  get,
  getOne,
  create,
  update,
  deleteOne,
  setValueReAuthenticate,
}
