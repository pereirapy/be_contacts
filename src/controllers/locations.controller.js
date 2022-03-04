import { responseNext } from '../shared/helpers/responseGeneric.helper'
import locationsService from '../services/locations.service'

const get = async (request, response, next) => {
  try {
    response.json(await locationsService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default { get }
