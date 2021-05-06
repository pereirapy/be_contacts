import HttpStatus from 'http-status-codes'
import {
  getOneWithDetails,
  createRecord,
  updateRecord,
  deleteRecord,
  getAll,
  getSummaryTotals,
  columnPrimary,
  fields,
  getFilters,
  contactsWithSamePhones
} from '../models/contacts.model'
import {
  fields as fieldsDetailsContact,
  createRecord as createRecordDetailsContact,
  deleteRecords as deleteRecordsDetailsContact,
  updateRecord as updateRecordDetailsContact,
  getDetailsIsWaitingFeedbackOneContact,
  getIDLastDetailsContactOneContact
} from '../models/detailsContacts.model'
import asyncPipe from 'pipeawait'
import {
  first,
  reduce,
  pipe,
  pick,
  isNull,
  curry,
  map,
  get as getLodash,
  omit,
  orderBy,
  getOr
} from 'lodash/fp'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import {
  WAITING_FEEDBACK,
  ERROR_PUBLISHER_ALREADY_WAITING_FEEDBACK,
  ERROR_CONTACT_PHONE_ALREADY_EXISTS
} from '../shared/constants/contacts.constant'
import {
  getParamsForUpdate,
  getParamsForGet,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForDelete
} from '../shared/helpers/generic.helper'

const getDetailsProps = detailsContact => {
  return pipe(
    pick([
      ...fieldsDetailsContact,
      'namePublisher',
      'idDetail',
      'createdByName',
      'updatedByName'
    ]),
    omit(['phoneContact'])
  )(detailsContact)
}

const getContactProps = contact => {
  return pick(fields, contact)
}

const reduceToGetDetails = (phone, listAllDetails) => {
  return pipe(
    orderBy(['createdAt'], ['desc']),
    reduce(
      (acc, current) =>
        phone === current.phone && !isNull(current.idDetail)
          ? [...acc, getDetailsProps(current)]
          : acc,
      []
    )
  )(listAllDetails)
}

const mountDetailsDataForOneContact = detailsContact => {
  const contact = first(detailsContact)
  return {
    ...getContactProps(contact),
    details: reduceToGetDetails(
      getLodash(columnPrimary, contact),
      detailsContact
    )
  }
}

const get = async request =>
  asyncPipe(getAll, curry(responseSuccess)(request))(getParamsForGet(request))

const getOne = async request =>
  asyncPipe(
    getOneWithDetails,
    mountDetailsDataForOneContact,
    curry(responseSuccess)(request)
  )(getParamsForGetOne(request))

const throwErrorIfExistsSameNumber = async bag => {
  const data = getOr(bag, 'data', bag)
  const contact = await contactsWithSamePhones(
    getLodash('phone', data),
    getLodash('phone2', data)
  )

  if (contact) {
    throw {
      httpErrorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: ERROR_CONTACT_PHONE_ALREADY_EXISTS,
      extra: { contact }
    }
  }
  return bag
}

const create = async request =>
  asyncPipe(
    throwErrorIfExistsSameNumber,
    createRecord,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const update = async request =>
  asyncPipe(
    throwErrorIfExistsSameNumber,
    updateRecord,
    curry(responseSuccess)(request)
  )(getParamsForUpdate(request))

const updateSomeRecords = request => {
  const updatedBy = getLodash('user.id', request)
  const body = getLodash('body', request)
  const detailsContacts = { ...getLodash('detailsContacts', body), updatedBy }
  const phones = getLodash('phones', body)
  const data = { ...getLodash('contact', body), updatedBy }

  return Promise.all(
    map(async id => {
      if (getLodash('idPublisher', detailsContacts)) {
        const lastDetailContactResult = await getIDLastDetailsContactOneContact(
          id
        )
        if (lastDetailContactResult)
          updateRecordDetailsContact({
            id: lastDetailContactResult.id,
            data: detailsContacts
          })
      }
      updateRecord({ id, data })
    }, phones)
  )
}

const updateSome = async request =>
  asyncPipe(updateSomeRecords, curry(responseSuccess)(request))(request)

const deleteOne = async request =>
  asyncPipe(
    deleteRecord,
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

const assign = async request =>
  asyncPipe(
    verifiyIfThisContactsAreAlreadyWaiting,
    assignAllContactsToAPublisher,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const verifiyIfThisContactsAreAlreadyWaiting = async data =>
  Promise.all(
    map(async phoneContact =>
      verifiyIfThisContactIsAlreadyWaiting(phoneContact)
    )(getLodash('phones', data))
  ).then(() => data)

const verifiyIfThisContactIsAlreadyWaiting = async phone => {
  const data = await getDetailsIsWaitingFeedbackOneContact(phone)
  if (data.length > 0) {
    throw {
      httpErrorCode: HttpStatus.BAD_REQUEST,
      error: ERROR_PUBLISHER_ALREADY_WAITING_FEEDBACK,
      extra: { phone }
    }
  }
  return phone
}

const assignAllContactsToAPublisher = async data =>
  Promise.all(
    map(async phoneContact =>
      createRecordDetailsContact({
        information: WAITING_FEEDBACK,
        idPublisher: getLodash('idPublisher', data),
        createdBy: getLodash('createdBy', data),
        phoneContact
      })
    )(getLodash('phones', data))
  )

const cancelAssign = async request =>
  asyncPipe(
    cancelAssignAllContactsToAPublisher,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const cancelAssignAllContactsToAPublisher = async data =>
  Promise.all(
    map(async phoneContact =>
      deleteRecordsDetailsContact({
        phoneContact,
        idPublisher: getLodash('idPublisher', data),
        information: WAITING_FEEDBACK
      })
    )(getLodash('phones', data))
  )

const getSummaryContacts = async user => {
  const totals = await getSummaryTotals(getLodash('id', user))
  const totalContacts = Number(totals.totalContacts.count)

  const totalContactsContacted = Number(totals.totalContactsContacted.count)
  const totalContactsNotCompanyContacted = Number(
    totals.totalContactsNotCompanyContacted.count
  )
  const totalContactsWithoutContact = totalContacts - totalContactsContacted
  const totalPercentContacted = (totalContactsContacted / totalContacts) * 100

  const totalPercentWithoutContacted = 100 - totalPercentContacted

  const totalContactsAssignByMeWaitingFeedback = Number(
    totals.totalContactsAssignByMeWaitingFeedback.count
  )
  const totalContactsWaitingFeedback = Number(
    totals.totalContactsWaitingFeedback.count
  )

  const totalPercentContactsWaitingFeedback =
    (totalContactsWaitingFeedback / totalContacts) * 100

  const totalPercentContactsAssignByMeWaitingFeedback =
    totalContactsWaitingFeedback > 0
      ? (totalContactsAssignByMeWaitingFeedback /
          totalContactsWaitingFeedback) *
        100
      : 0
  const totalContactsAssignByOthersWaitingFeedback =
    totalContactsWaitingFeedback - totalContactsAssignByMeWaitingFeedback

  const totalPercentContactsAssignByOthersWaitingFeedback =
    totalContactsWaitingFeedback > 0
      ? 100 - totalPercentContactsAssignByMeWaitingFeedback
      : 0

  const calculatePercentage = count =>
    (count / totalContactsWaitingFeedback) * 100

  const totalsContactsWaitingFeedbackByPublisher = map(
    publisher => ({
      ...publisher,
      percent: calculatePercentage(publisher.count)
    }),
    totals.totalsContactsWaitingFeedbackByPublisher
  )

  const totalContactsByGender = totals.totalContactsByGender

  const calculatePercentageByGender = count =>
    (count / totalContactsNotCompanyContacted) * 100

  const totalContactsByGenderContacted = map(
    gender => ({
      ...gender,
      percent: calculatePercentageByGender(gender.count)
    }),
    totals.totalContactsByGenderContacted
  )

  const totalContactsByLanguage = totals.totalContactsByLanguage

  const calculatePercentageByLanguage = count =>
    (count / totalContactsContacted) * 100

  const totalContactsByLanguageContacted = map(
    language => ({
      ...language,
      percent: calculatePercentageByLanguage(language.count)
    }),
    totals.totalContactsByLanguageContacted
  )

  const calculatePercentageByType = count => (count / totalContacts) * 100

  const totalContactsByType = map(
    type => ({
      ...type,
      percent: calculatePercentageByType(type.count)
    }),
    totals.totalContactsByType
  )

  const totalContactsByLocation = totals.totalContactsByLocation

  const calculatePercentageByLocation = count =>
    (count / totalContactsContacted) * 100

  const totalContactsByLocationContacted = map(
    location => ({
      ...location,
      percent: calculatePercentageByLocation(location.count)
    }),
    totals.totalContactsByLocationContacted
  )

  return {
    totalContacts,
    totalContactsContacted,
    totalContactsWithoutContact,
    totalPercentContacted,
    totalPercentWithoutContacted,
    totalPercentContactsWaitingFeedback,
    totalContactsWaitingFeedback,
    totalContactsAssignByMeWaitingFeedback,
    totalPercentContactsAssignByMeWaitingFeedback,
    totalsContactsWaitingFeedbackByPublisher,
    totalContactsAssignByOthersWaitingFeedback,
    totalPercentContactsAssignByOthersWaitingFeedback,
    totalContactsByGender,
    totalContactsByGenderContacted,
    totalContactsByLanguage,
    totalContactsByLanguageContacted,
    totalContactsByType,
    totalContactsByLocation,
    totalContactsByLocationContacted
  }
}

const getAllFiltersOfContacts = async request =>
  asyncPipe(
    getFilters,
    curry(responseSuccess)(request)
  )(getParamsForGet(request))

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
