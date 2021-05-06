import contactsService from '../services/contacts.service'
import { responseNext } from '../shared/helpers/responseGeneric.helper'
import { get as getLodash } from 'lodash/fp'

const get = async (request, response, next) => {
  try {
    response.json(await contactsService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getAllFiltersOfContacts = async (request, response, next) => {
  try {
    response.json(await contactsService.getAllFiltersOfContacts(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getOne = async (request, response, next) => {
  try {
    response.json(await contactsService.getOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await contactsService.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await contactsService.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const updateSome = async (request, response, next) => {
  try {
    response.json(await contactsService.updateSome(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await contactsService.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const assign = async (request, response, next) => {
  try {
    response.json(await contactsService.assign(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const cancelAssign = async (request, response, next) => {
  try {
    response.json(await contactsService.cancelAssign(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}
const getSummaryContacts = async (request, response, next) => {
  try {
    response.json(
      await contactsService.getSummaryContacts(getLodash('user', request))
    )
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default {
  get,
  getOne,
  create,
  update,
  updateSome,
  deleteOne,
  assign,
  cancelAssign,
  getSummaryContacts,
  getAllFiltersOfContacts
}
