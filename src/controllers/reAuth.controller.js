import HttpStatus from 'http-status-codes'
import {
  responseNext,
  responseError
} from '../shared/helpers/responseGeneric.helper'
import { getRecordForAuth } from '../models/publishers.model'
import {
  NO_EMAIL_VALID,
  NOT_ACTIVE
} from '../shared/constants/publishers.constant'
import { getOr } from 'lodash/fp'
import authController from './auth.controller'
import publisherService from '../services/publishers.service'

const reAuthenticate = async (req, res, next) => {
  try {
    const { email } = req.body
    const publisher = await getRecordForAuth(email, 'email')

    if (!publisher) {
      return next(
        responseError({
          cod: NO_EMAIL_VALID,
          error: NO_EMAIL_VALID,
          httpErrorCode: HttpStatus.UNAUTHORIZED
        })
      )
    }

    if (!getOr(false, 'active', publisher)) {
      return next(
        responseError({
          cod: NOT_ACTIVE,
          error: NOT_ACTIVE,
          httpErrorCode: HttpStatus.UNAUTHORIZED
        })
      )
    }
    await publisherService.setValueReAuthenticate(publisher.id, false)

    res.json(authController.jwtSignIn(publisher))
  } catch (error) {
    next(responseNext(error, req))
  }
}

export default { reAuthenticate }
