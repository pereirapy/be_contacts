import { responseError } from '../helpers/responseGeneric.helper'
import HttpStatus from 'http-status-codes'
import simpleLog from 'simple-node-logger'

const getIP = (req) =>
  req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  (req.connection.socket ? req.connection.socket.remoteAddress : null)

const getWhereCameFrom = (req) => req.baseUrl || req.originalUrl

const errorHandler = (err, req, res, next) => {
  if (!err) return next()
  const log = simpleLog.createSimpleLogger('errorHandler.log')
  const codStatus = err.httpErrorCode
    ? err.httpErrorCode
    : HttpStatus.INTERNAL_SERVER_ERROR

  log.error(
    new Date().toJSON(),
    ' error at url: ',
    getWhereCameFrom(req),
    ' IP: ',
    getIP(req),
    ' error: ',
    err,
    ' at ',
    ' request headers: ',
    req.headers
  )

  res.status(codStatus).json(responseError(err))
}

export default errorHandler
