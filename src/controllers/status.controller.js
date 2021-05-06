import { responseNext } from '../shared/helpers/responseGeneric.helper'
import statusService from '../services/status.service'

const get = async (request, response, next) => {
  try {
    response.json(await statusService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await statusService.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await statusService.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await statusService.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default { get, create, update, deleteOne }
