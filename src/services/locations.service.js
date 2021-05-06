const { getAll } = require('../models/locations.model')
import { getParamsForGet } from '../shared/helpers/generic.helper'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import asyncPipe from 'pipeawait'
import { curry } from 'lodash/fp'

const get = async request => {
  return asyncPipe(
    getAll,
    curry(responseSuccess)(request)
  )(getParamsForGet(request))
}

export default { get }
