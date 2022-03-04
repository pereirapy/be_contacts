const { getAll } = require('../models/responsibility.model')
import { getParamsForGetWithUser } from '../shared/helpers/generic.helper'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import asyncPipe from 'pipeawait'
import { curry } from 'lodash/fp'

const get = async (request) => {
  const paramsQuery = {
    ...getParamsForGetWithUser(request),
    sort: 'description:asc',
  }
  return asyncPipe(getAll, curry(responseSuccess)(request))(paramsQuery)
}

export default { get }
