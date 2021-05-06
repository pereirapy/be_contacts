import HttpStatus from 'http-status-codes'
import { responseError } from '../helpers/responseGeneric.helper'
import { NOT_FOUND } from '../constants/security.constant'

const notFoundHandler = (req, res) => {
  res.status(HttpStatus.NOT_FOUND).json(
    responseError({
      cod: NOT_FOUND,
      message: NOT_FOUND,
      httpErrorCode: HttpStatus.NOT_FOUND
    })
  )
}

export default notFoundHandler
