import { responseNext } from '../shared/helpers/responseGeneric.helper'
import languagesService from '../services/languages.service'

const get = async (request, response, next) => {
  try {
    response.json(await languagesService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await languagesService.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await languagesService.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await languagesService.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default { get, create, update, deleteOne }
