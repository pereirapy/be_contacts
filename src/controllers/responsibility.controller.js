import { responseNext } from '../shared/helpers/responseGeneric.helper'
import responsibilityService from '../services/responsibility.service'

const get = async (request, response, next) => {
  try {
    response.json(await responsibilityService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default { get }
