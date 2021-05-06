import { get, isArray, map } from 'lodash/fp'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constants/security.constant'
import crypto from 'crypto'

const getParamsForUpdate = request => ({
  data: appendEssentialData(request, 'updatedBy'),
  id: get('params.id', request)
})

const getParamsForGet = request => get('query', request)
const getParamsForGetWithUser = request => ({
  query: get('query', request),
  user: get('user', request)
})
const getParamsForCreate = request => appendEssentialData(request, 'createdBy')
const getParamsForGetOne = request => get('params.id', request)
const getParamsForGetOneWithUser = request => ({
  id: get('params.id', request),
  user: get('user', request)
})
const getParamsForGetOneWithQuery = request => ({
  id: get('params.id', request),
  query: get('query', request)
})
const getParamsForDelete = request => getParamsForGetOne(request)

const defaultValueForQuery = (request, objectDefault) => {
  return { ...objectDefault, ...getParamsForGet(request) }
}
const createJwtToken = param =>
  jwt.sign(param, process.env.JWT_KEY || JWT_SECRET)

const appendEssentialData = (request, field) =>
  isArray(get('body', request))
    ? map(
        data => ({ ...data, [field]: get('user.id', request) }),
        get('body', request)
      )
    : { ...get('body', request), [field]: get('user.id', request) }

const encrypt = password => crypto.createHmac('sha256', password).digest('hex')

export {
  getParamsForGet,
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForDelete,
  defaultValueForQuery,
  createJwtToken,
  encrypt,
  getParamsForGetOneWithUser,
  getParamsForGetOneWithQuery,
  getParamsForGetWithUser
}
