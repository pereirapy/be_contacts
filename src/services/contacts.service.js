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
  contactsWithSamePhones,
} from '../models/contacts.model'
import {
  fields as fieldsDetailsContact,
  createRecord as createRecordDetailsContact,
  deleteRecords as deleteRecordsDetailsContact,
  updateRecord as updateRecordDetailsContact,
  updateRecords as updateRecordsDetailsContact,
  getDetailsIsWaitingFeedbackOneContact,
  getIDLastDetailsContactOneContact,
  updateIsLastValueOneContact,
} from '../models/detailsContacts.model'
import {
  getDetailsCampaignActive,
  getOne as getOneCampaign,
} from '../models/campaigns.model'
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
  getOr,
} from 'lodash/fp'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import {
  WAITING_FEEDBACK,
  ERROR_PUBLISHER_ALREADY_WAITING_FEEDBACK,
  ERROR_CONTACT_PHONE_ALREADY_EXISTS,
  ERROR_ID_CAMPAIGN_IS_MISSING,
  ERROR_ID_CAMPAIGN_NOT_EXISTS,
} from '../shared/constants/contacts.constant'
import { URL_DROPBOX } from '../shared/constants/db.constant'

import {
  getParamsForUpdate,
  getParamsForGet,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForGetWithUser,
  getParamsForDelete,
  getParamsForGetOneWithUser,
} from '../shared/helpers/generic.helper'
import fs from 'fs'
import { execute } from '@getvim/execute'
import axios from 'axios'

const getDetailsProps = (detailsContact) => {
  return pipe(
    pick([
      ...fieldsDetailsContact,
      'namePublisher',
      'idDetail',
      'createdByName',
      'updatedByName',
    ]),
    omit(['phoneContact'])
  )(detailsContact)
}

const getContactProps = (contact) => {
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

const mountDetailsDataForOneContact = (detailsContact) => {
  const contact = first(detailsContact)
  return {
    ...getContactProps(contact),
    details: reduceToGetDetails(
      getLodash(columnPrimary, contact),
      detailsContact
    ),
  }
}

const get = async ({ input, request }) =>
  asyncPipe(getAll, curry(responseSuccess)(request))(input)

const getOne = async (request) =>
  asyncPipe(
    getOneWithDetails,
    mountDetailsDataForOneContact,
    curry(responseSuccess)(request)
  )(getParamsForGetOne(request))

const throwErrorIfExistsSameNumber = async (bag) => {
  const data = getOr(bag, 'data', bag)
  const contact = await contactsWithSamePhones(
    getLodash('phone', data),
    getLodash('phone2', data)
  )

  if (contact) {
    throw {
      httpErrorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: ERROR_CONTACT_PHONE_ALREADY_EXISTS,
      extra: { contact },
    }
  }
  return bag
}

const create = async (request) =>
  asyncPipe(
    throwErrorIfExistsSameNumber,
    createRecord,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const addUpdatedAt = (data) => ({
  ...data,
  data: {
    ...data.data,
    updatedAt: new Date(),
  },
})

const update = async (request) =>
  asyncPipe(
    throwErrorIfExistsSameNumber,
    addUpdatedAt,
    updateRecord,
    curry(responseSuccess)(request)
  )(getParamsForUpdate(request))

const updateSomeRecords = (request) => {
  const updatedBy = getLodash('user.id', request)
  const updatedAt = new Date()
  const body = getLodash('body', request)
  const detailsContacts = {
    ...getLodash('detailsContacts', body),
    updatedBy,
    updatedAt,
  }
  const phones = getLodash('phones', body)
  const data = { ...getLodash('contact', body), updatedBy, updatedAt }
  return Promise.all(
    map(async (id) => {
      if (getLodash('idPublisher', detailsContacts)) {
        const lastDetailContactResult = await getIDLastDetailsContactOneContact(
          id
        )
        if (lastDetailContactResult)
          updateRecordDetailsContact({
            id: lastDetailContactResult.id,
            data: detailsContacts,
          })
      }
      updateRecord({ id, data })
    }, phones)
  )
}

const updateSome = async (request) =>
  asyncPipe(updateSomeRecords, curry(responseSuccess)(request))(request)

const deleteOne = async (request) =>
  asyncPipe(
    deleteRecord,
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

const assign = async (request) =>
  asyncPipe(
    verifyIfThisContactsAreAlreadyWaiting,
    setIsLastToFalseOnDetailsContacts,
    assignAllContactsToAPublisher,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const verifyIfThisContactsAreAlreadyWaiting = async (data) =>
  Promise.all(
    map(async (phoneContact) =>
      verifyIfThisContactIsAlreadyWaiting(phoneContact)
    )(getLodash('phones', data))
  ).then(() => data)

const verifyIfThisContactIsAlreadyWaiting = async (phone) => {
  const data = await getDetailsIsWaitingFeedbackOneContact(phone)
  if (data.length > 0) {
    throw {
      httpErrorCode: HttpStatus.BAD_REQUEST,
      error: ERROR_PUBLISHER_ALREADY_WAITING_FEEDBACK,
      extra: { phone },
    }
  }
  return phone
}

const setIsLastToFalseOnDetailsContacts = async (data) =>
  Promise.all(
    map(async (phoneContact) =>
      updateRecordsDetailsContact({
        where: { phoneContact },
        data: { isLast: false },
      })
    )(getLodash('phones', data))
  ).then(() => data)

const assignAllContactsToAPublisher = async (data) =>
  Promise.all(
    map(async (phoneContact) =>
      createRecordDetailsContact({
        information: WAITING_FEEDBACK,
        idPublisher: getLodash('idPublisher', data),
        idCampaign: getLodash('idCampaign', data),
        createdBy: getLodash('createdBy', data),
        isLast: true,
        phoneContact,
      })
    )(getLodash('phones', data))
  )

const cancelAssign = async (request) =>
  asyncPipe(
    cancelAssignAllContactsToAPublisher,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const cancelAssignAllContactsToAPublisher = async (data) =>
  Promise.all(
    map(async (phoneContact) =>
      pipe(
        deleteRecordsDetailsContact({
          phoneContact,
          idPublisher: getLodash('idPublisher', data),
          information: WAITING_FEEDBACK,
        }),
        updateIsLastValueOneContact
      )(phoneContact)
    )(getLodash('phones', data))
  )

const getSummary = async ({ user, idCampaign }) => {
  const totals = await getSummaryTotals(getLodash('id', user), idCampaign)
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

  const calculatePercentage = (count) =>
    (count / totalContactsWaitingFeedback) * 100

  const totalsContactsWaitingFeedbackByPublisher = map(
    (publisher) => ({
      ...publisher,
      percent: calculatePercentage(publisher.count),
    }),
    totals.totalsContactsWaitingFeedbackByPublisher
  )

  const totalContactsByGender = totals.totalContactsByGender

  const calculatePercentageByGender = (count) =>
    (count / totalContactsNotCompanyContacted) * 100

  const totalContactsByGenderContacted = map(
    (gender) => ({
      ...gender,
      percent: calculatePercentageByGender(gender.count),
    }),
    totals.totalContactsByGenderContacted
  )

  const totalContactsByLanguage = totals.totalContactsByLanguage

  const calculatePercentageByLanguage = (count) =>
    (count / totalContactsContacted) * 100

  const totalContactsByLanguageContacted = map(
    (language) => ({
      ...language,
      percent: calculatePercentageByLanguage(language.count),
    }),
    totals.totalContactsByLanguageContacted
  )

  const calculatePercentageByType = (count) => (count / totalContacts) * 100

  const totalContactsByType = map(
    (type) => ({
      ...type,
      percent: calculatePercentageByType(type.count),
    }),
    totals.totalContactsByType
  )

  const totalContactsByLocation = totals.totalContactsByLocation

  const calculatePercentageByLocation = (count) =>
    (count / totalContactsContacted) * 100

  const totalContactsByLocationContacted = map(
    (location) => ({
      ...location,
      percent: calculatePercentageByLocation(location.count),
    }),
    totals.totalContactsByLocationContacted
  )

  const totalContactsReachedGoal = Number(totals.totalContactsReachedGoal.count)
  const totalContactsNoReachedGoal =
    totalContactsContacted - totalContactsReachedGoal

  const totalPercentContactsReachedGoal =
    (totalContactsReachedGoal / totalContactsContacted) * 100

  const totalPercentContactsNoReachedGoal =
    100 - totalPercentContactsReachedGoal

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
    totalContactsByLocationContacted,
    totalPercentContactsReachedGoal,
    totalContactsReachedGoal,
    totalPercentContactsNoReachedGoal,
    totalContactsNoReachedGoal,
  }
}

const getSummaryContacts = async (request) => {
  const { user } = getParamsForGetWithUser(request)
  return getSummary({ user })
}

const getSummaryOneCampaign = async (request) => {
  const { user, id } = getParamsForGetOneWithUser(request)
  if (!id || id === 'undefined') {
    throw {
      httpErrorCode: HttpStatus.BAD_REQUEST,
      error: ERROR_ID_CAMPAIGN_IS_MISSING,
      extra: { idCampaign: id },
    }
  }

  const campaign = await getOneCampaign(id)
  if (!campaign) {
    throw {
      httpErrorCode: HttpStatus.BAD_REQUEST,
      error: ERROR_ID_CAMPAIGN_NOT_EXISTS,
      extra: { idCampaign: id },
    }
  }

  const idCampaign = campaign.id
  return getSummary({ user, idCampaign })
}

const getAllFiltersOfContacts = async (request) =>
  asyncPipe(
    getFilters,
    curry(responseSuccess)(request)
  )(getParamsForGet(request))

const backup = async () => {
  const username = process.env.USERNAME
  const database = process.env.DATABASE
  const date = new Date()
  const currentDate = `${date.getMonth() + 1}`
  const fileName = `contacts-database-bkp-${currentDate}.tar`
  try {
    await execute(`pg_dump -U ${username} -d ${database} -f ${fileName} -F t`)

    const data = fs.readFileSync(fileName, 'utf8')
    const options = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${process.env.DROPBOX_TOKEN}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: '/' + fileName,
          mode: 'overwrite',
          autorename: true,
          mute: false,
          strict_conflict: false,
        }),
        'Content-Type': 'application/octet-stream',
      },
      timeout: 10000,
    }
    await axios.post(URL_DROPBOX, data, options)
    let bkpDeletedAtServer = true
    fs.unlink(fileName, (err) => {
      if (err) bkpDeletedAtServer = false
    })
    return { res: true, bkpDeletedAtServer }
  } catch (error) {
    return { status: false, error }
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
  getAllFiltersOfContacts,
  backup,
  getSummaryOneCampaign,
}
