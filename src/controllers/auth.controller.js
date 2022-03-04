import HttpStatus from 'http-status-codes'
import {
  responseNext,
  responseError,
} from '../shared/helpers/responseGeneric.helper'
import { getRecordForAuth, omitColumns } from '../models/publishers.model'
import publisherService from '../services/publishers.service'
import {
  NO_EMAIL_VALID,
  PASSWORD_WRONG,
  NOT_ACTIVE,
} from '../shared/constants/publishers.constant'
import { AUTHORIZED } from '../shared/constants/security.constant'
import { getOr, get, omit } from 'lodash/fp'
import { createJwtToken, encrypt } from '../shared/helpers/generic.helper'

const authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const publisher = await getRecordForAuth(email, 'email')
    const encryptPassword = encrypt(password)
    if (!publisher) {
      return next(
        responseError({
          cod: NO_EMAIL_VALID,
          error: NO_EMAIL_VALID,
          httpErrorCode: HttpStatus.UNAUTHORIZED,
        })
      )
    }
    if (getOr('', 'password', publisher) !== encryptPassword) {
      return next(
        responseError({
          cod: PASSWORD_WRONG,
          error: PASSWORD_WRONG,
          httpErrorCode: HttpStatus.UNAUTHORIZED,
        })
      )
    }

    if (!getOr(false, 'active', publisher)) {
      return next(
        responseError({
          cod: NOT_ACTIVE,
          error: NOT_ACTIVE,
          httpErrorCode: HttpStatus.UNAUTHORIZED,
        })
      )
    }

    await publisherService.setValueReAuthenticate(publisher.id, false)

    res.json(jwtSignIn(publisher))
  } catch (error) {
    next(responseNext(error, req))
  }
}

const jwtSignIn = (publisher) => {
  const jwtToken = createJwtToken({
    email: get('email', publisher),
    id: get('id', publisher),
    idResponsibility: get('idResponsibility', publisher),
  })
  const publisherDataPublic = omit(omitColumns, publisher)
  return {
    status: true,
    cod: AUTHORIZED,
    data: {
      ...publisherDataPublic,
      jwtToken,
    },
  }
}

export default { authenticate, jwtSignIn }
