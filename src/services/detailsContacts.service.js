import asyncPipe from 'pipeawait'
import HttpStatus from 'http-status-codes'
import { curry, get as getLodash } from 'lodash/fp'

import {
  getOne,
  getDetailsAllContactWaitingFeedback,
  getDetailsIsWaitingFeedbackOneContact,
  getFiltersWaitingFeedback,
  getDetailsAllContact,
  getDetailsOneContact,
  createRecord,
  updateRecord,
  updateRecords,
  deleteRecord,
  updateIsLastValueOneContact,
  getDetailsContactOneCampaign,
} from '../models/detailsContacts.model'
import {
  getParamsForGetOne,
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery,
  getParamsForGetOneWithQuery,
  getParamsForGetWithUser,
} from '../shared/helpers/generic.helper'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import { updateRecord as updateRecordContacts } from '../models/contacts.model'
import { ERROR_PUBLISHER_ALREADY_WAITING_FEEDBACK } from '../shared/constants/contacts.constant'

const get = async (request) => {
  const paramsQuery = defaultValueForQuery(request, {
    sort: 'description:asc',
  })
  return asyncPipe(
    getDetailsAllContact,
    curry(responseSuccess)(request)
  )(paramsQuery)
}

const getAllWaitingFeedback = async (request) => {
  return asyncPipe(
    getDetailsAllContactWaitingFeedback,
    curry(responseSuccess)(request)
  )(getParamsForGetWithUser(request))
}

const getAllFiltersWaitingFeedback = async (request) =>
  asyncPipe(
    getFiltersWaitingFeedback,
    curry(responseSuccess)(request)
  )(getParamsForGetWithUser(request))

const getAllDetailsOneContact = async (request) => {
  return asyncPipe(
    getDetailsOneContact,
    curry(responseSuccess)(request)
  )(getParamsForGetOneWithQuery(request))
}

const getOneDetail = async (request) => {
  return asyncPipe(
    getOne,
    curry(responseSuccess)(request)
  )(getParamsForGetOne(request))
}

const create = async (request) => {
  const data = getParamsForCreate(request)
  const dataDetailsContact = {
    ...getLodash('detailsContact', data),
    createdBy: getLodash('createdBy', data),
    isLast: true,
  }

  const dataUpdateDetailsContactsIsLast = {
    where: { phoneContact: dataDetailsContact.phoneContact },
    data: { isLast: false },
  }

  const dataContact = {
    data: {
      ...getLodash('contact', data),
      updatedBy: getLodash('user.id', request),
    },
    id: getLodash('contact.phone', data),
  }

  const dataContactsWaitingFeedback =
    await getDetailsIsWaitingFeedbackOneContact(dataContact.id)

  if (dataContactsWaitingFeedback.length > 0) {
    throw {
      httpErrorCode: HttpStatus.BAD_REQUEST,
      error: ERROR_PUBLISHER_ALREADY_WAITING_FEEDBACK,
      extra: { phone: dataContact.id },
    }
  }

  const resContacts = await updateRecordContacts(dataContact)
  const detailsContact = await asyncPipe(
    (data) => {
      updateRecords(dataUpdateDetailsContactsIsLast)
      return data
    },
    createRecord,
    curry(responseSuccess)(request)
  )(dataDetailsContact)

  return {
    contacts: resContacts,
    detailsContact,
  }
}

const update = async (request) => {
  const data = getParamsForUpdate(request)
  const dataDetailsContact = {
    data: {
      ...getLodash('data.detailsContact', data),
      updatedBy: getLodash('user.id', request),
      updatedAt: new Date(),
    },
    id: getLodash('id', data),
  }
  const dataContact = {
    data: {
      ...getLodash('data.contact', data),
      updatedBy: getLodash('user.id', request),
    },
    id: getLodash('data.contact.phone', data),
  }

  const resContacts = await updateRecordContacts(dataContact)
  return {
    contacts: resContacts,
    detailsContact: await asyncPipe(
      updateRecord,
      curry(responseSuccess)(request)
    )(dataDetailsContact),
  }
}

const deleteOneDetailAndReturnPhone = async ({ id, phoneContact }) => {
  await deleteRecord(id)
  return phoneContact
}

const deleteOne = async (request) =>
  asyncPipe(
    getOne,
    deleteOneDetailAndReturnPhone,
    curry(updateIsLastValueOneContact)(true),
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

const hasSomeContactDuringTheCampaign = async (request) => {
  return asyncPipe(
    getDetailsContactOneCampaign,
    (data) => {
      return {
        res: data.length > 0
      }
    },
    curry(responseSuccess)(request)
  )(getParamsForGetOneWithQuery(request))
}

export default {
  get,
  getAllDetailsOneContact,
  getOneDetail,
  getAllWaitingFeedback,
  getAllFiltersWaitingFeedback,
  create,
  update,
  deleteOne,
  hasSomeContactDuringTheCampaign,
}
