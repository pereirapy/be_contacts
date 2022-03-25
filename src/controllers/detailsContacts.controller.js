import detailsService from '../services/detailsContacts.service'
import { responseNext } from '../shared/helpers/responseGeneric.helper'

const get = async (request, response, next) => {
  try {
    response.json(await detailsService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getAllWaitingFeedback = async (request, response, next) => {
  try {
    response.json(await detailsService.getAllWaitingFeedback(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getAllFiltersWaitingFeedback = async (request, response, next) => {
  try {
    response.json(await detailsService.getAllFiltersWaitingFeedback(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getOne = async (request, response, next) => {
  try {
    response.json(await detailsService.getOneDetail(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getDetailsOneContact = async (request, response, next) => {
  try {
    response.json(await detailsService.getAllDetailsOneContact(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await detailsService.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await detailsService.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await detailsService.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const hasSomeContactDuringTheCampaign = async (request, response, next) => {
  try {
    response.json(await detailsService.hasSomeContactDuringTheCampaign(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default {
  get,
  getOne,
  getDetailsOneContact,
  getAllWaitingFeedback,
  getAllFiltersWaitingFeedback,
  create,
  update,
  deleteOne,
  hasSomeContactDuringTheCampaign,
}
