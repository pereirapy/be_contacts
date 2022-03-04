import HttpStatus from 'http-status-codes'
import { ERROR_ON_PERMISSIONS } from '../constants/security.constant'

import permissionsService from '../../services/permissions.service'
import { responseError } from '../helpers/responseGeneric.helper'

const permissionGuard = async (req, res, next) => {
  try {
    await permissionsService.checkPermissions(req)
    return next()
  } catch (error) {
    next(
      responseError({
        cod: ERROR_ON_PERMISSIONS,
        httpErrorCode: HttpStatus.FORBIDDEN,
        error,
      })
    )
  }
}

export { permissionGuard }
