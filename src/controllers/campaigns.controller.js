import { responseNext } from '../shared/helpers/responseGeneric.helper'
import campaignsService from '../services/campaigns.service'

const get = async (request, response, next) => {
  try {
    response.json(await campaignsService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getOne = async (request, response, next) => {
  try {
    response.json(await campaignsService.getOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getAllContactsOneCampaign = async (request, response, next) => {
  try {
    response.json(await campaignsService.getAllContactsOneCampaign(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getAllContactsOneCampaignFilters = async (request, response, next) => {
  try {
    response.json(await campaignsService.getAllContactsOneCampaignFilters(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getDetailsCampaignActive = async (request, response, next) => {
  try {
    response.json(await campaignsService.getDetailsCampaignActive(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getDetailsNextCampaign = async (request, response, next) => {
  try {
    response.json(await campaignsService.getDetailsNextCampaign(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await campaignsService.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await campaignsService.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await campaignsService.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default {
  get,
  getOne,
  getAllContactsOneCampaign,
  getAllContactsOneCampaignFilters,
  getDetailsCampaignActive,
  getDetailsNextCampaign,
  create,
  update,
  deleteOne,
}
