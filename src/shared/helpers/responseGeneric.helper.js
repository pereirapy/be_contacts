import HttpStatus from 'http-status-codes'
import { find, pipe, get, isObject } from 'lodash/fp'

import {
  GET_ERROR,
  POST_ERROR,
  PUT_ERROR,
  DEL_ERROR,
  GET_OK,
  POST_OK,
  PUT_OK,
  DEL_OK
} from '../constants/db.constant'

const methods = [
  { method: 'GET', errorDesc: GET_ERROR, successDesc: GET_OK },
  { method: 'POST', errorDesc: POST_ERROR, successDesc: POST_OK },
  { method: 'PUT', errorDesc: PUT_ERROR, successDesc: PUT_OK },
  { method: 'DELETE', errorDesc: DEL_ERROR, successDesc: DEL_OK }
]

const findCod = (request, type) =>
  pipe(find({ method: request.method }), get(type))(methods)

const responseSuccess = (request, data) => ({
  status: true,
  cod: findCod(request, 'successDesc'),
  data
})

const responseError = err =>
  isObject(err)
    ? {
        ...err,
        status: false,
        httpErrorCode: err.httpErrorCode || HttpStatus.INTERNAL_SERVER_ERROR,
        cod: err.cod,
        error: err.message || err.response || err.error || err
      }
    : {
        status: false,
        httpErrorCode: err.httpErrorCode || HttpStatus.INTERNAL_SERVER_ERROR,
        cod: err.cod,
        error: err.message || err.response || err.error || err
      }

const responseNext = (error, request) =>
  isObject(error)
    ? {
        ...error,
        error: error.error || error,
        httpErrorCode: error.httpErrorCode || HttpStatus.INTERNAL_SERVER_ERROR,
        cod: findCod(request, 'errorDesc')
      }
    : {
        error: error.error || error,
        httpErrorCode: error.httpErrorCode || HttpStatus.INTERNAL_SERVER_ERROR,
        cod: findCod(request, 'errorDesc')
      }

export { responseSuccess, responseError, responseNext }
