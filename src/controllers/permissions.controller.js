import { responseNext } from '../shared/helpers/responseGeneric.helper'
import permissionsService from '../services/permissions.service'

const get = async (request, response, next) => {
  try {
    response.json(await permissionsService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await permissionsService.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await permissionsService.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await permissionsService.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default { get, create, update, deleteOne }
