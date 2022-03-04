import { responseNext } from '../shared/helpers/responseGeneric.helper'
import publishersService from '../services/publishers.service'

const getAllInformationWithPagination = async (request, response, next) => {
  try {
    response.json(
      await publishersService.getAllInformationWithPagination(request)
    )
  } catch (error) {
    next(responseNext(error, request))
  }
}
const get = async (request, response, next) => {
  try {
    response.json(await publishersService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getAllActives = async (request, response, next) => {
  try {
    response.json(await publishersService.getAllActives(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getAllFiltersOfPublishers = async (request, response, next) => {
  try {
    response.json(await publishersService.getAllFiltersOfPublishers(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getOne = async (request, response, next) => {
  try {
    response.json(await publishersService.getOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await publishersService.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await publishersService.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await publishersService.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default {
  getAllInformationWithPagination,
  getAllFiltersOfPublishers,
  getAllActives,
  get,
  getOne,
  create,
  update,
  deleteOne,
}
