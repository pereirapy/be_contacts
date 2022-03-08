import HttpStatus from 'http-status-codes'
import * as campaignsModel from '../models/campaigns.model'

import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery,
  getParamsForGetOneWithQuery,
  getParamsForGetOne,
  getParamsForGetOneWithUser
} from '../shared/helpers/generic.helper'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import asyncPipe from 'pipeawait'
import { curry, getOr, get as getLodash } from 'lodash/fp'
import { ERROR_CAMPAIGN_SAME_INTERVAL_DATE } from '../shared/constants/campaigns.constant'

const get = async (request) => {
  const paramsQuery = defaultValueForQuery(request, {
    sort: '"dateStart":desc',
  })
  return asyncPipe(
    campaignsModel.getAll,
    curry(responseSuccess)(request)
  )(paramsQuery)
}

const getOne = async (request) =>
  asyncPipe(
    campaignsModel.getOne,
    curry(responseSuccess)(request)
  )(getParamsForGetOne(request))

const getAllContactsOneCampaign = async (request) => {
  return asyncPipe(
    campaignsModel.getAllContactsOneCampaign,
    curry(responseSuccess)(request)
  )(getParamsForGetOneWithQuery(request))
}

const getAllContactsOneCampaignFilters = async (request) => {
  return asyncPipe(
    campaignsModel.getAllContactsOneCampaignFilters,
    curry(responseSuccess)(request)
  )(getParamsForGetOneWithUser(request))
}

const getDetailsCampaignActive = async (request) => {
  return asyncPipe(
    campaignsModel.getDetailsCampaignActive,
    curry(responseSuccess)(request)
  )()
}

const getDetailsNextCampaign = async (request) => {
  return asyncPipe(
    campaignsModel.getDetailsNextCampaign,
    curry(responseSuccess)(request)
  )()
}

const verifyIfExistsAnotherCampaignActive = async (bag) => {
  const dataCampaign = getOr(bag, 'data', bag)

  const currentCampaignActive = await campaignsModel.getCampaignByIntervalDate(
    getLodash('dateStart', dataCampaign),
    getLodash('dateFinal', dataCampaign)
  )
  if (currentCampaignActive && dataCampaign.id !== currentCampaignActive.id) {
    throw {
      httpErrorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: ERROR_CAMPAIGN_SAME_INTERVAL_DATE,
      extra: { name: currentCampaignActive.name },
    }
  }
  return bag
}

const create = async (request) =>
  asyncPipe(
    verifyIfExistsAnotherCampaignActive,
    campaignsModel.createRecord,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const update = async (request) =>
  asyncPipe(
    verifyIfExistsAnotherCampaignActive,
    campaignsModel.updateRecord,
    curry(responseSuccess)(request)
  )(getParamsForUpdate(request))

const deleteOne = async (request) =>
  asyncPipe(
    campaignsModel.deleteRecord,
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

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
