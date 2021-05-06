import knex from '../config/connection'
import * as detailsContact from './detailsContacts.model'
import crud from './crudGeneric.model'
import { WAITING_FEEDBACK } from '../shared/constants/contacts.constant'
import {
  isEmpty,
  map,
  contains,
  first,
  last,
  reduce,
  concat,
  isNil,
  some,
  compact
} from 'lodash/fp'

const tableName = 'contacts'
const columnPrimary = 'phone'
const fields = [
  'phone',
  'name',
  'owner',
  'idStatus',
  'idLanguage',
  'languageName',
  'statusDescription',
  'gender',
  'namePublisher',
  'phone2',
  'idLocation',
  'email',
  'note',
  'typeCompany'
]

const getAll = async queryParams => {
  const {
    sort = 'lastConversationInDays:DESC',
    perPage,
    currentPage,
    filters
  } = queryParams
  const sql = knex
    .select(
      'name',
      'owner',
      'phone',
      'idStatus',
      'idLanguage',
      'gender',
      'typeCompany',
      'idLocation',
      'locationName',
      'departmentName',
      'email',
      'note',
      'languageName',
      'statusDescription',
      'createdAtDetailsContacts',
      'lastConversationInDays',
      'publisherName',
      'information',
      'createdAtDetailsContacts'
    )
    .from('viewListContacts')
  if (!isEmpty(filters)) {
    const {
      name,
      owner,
      phone,
      genders,
      note,
      languages,
      status,
      locations,
      typeCompany
    } = JSON.parse(filters)

    if (
      !isEmpty(name) &&
      !isEmpty(phone) &&
      !isEmpty(note) &&
      !isEmpty(owner)
    ) {
      sql.where(builder =>
        builder
          .where('name', 'ilike', `%${name}%`)
          .orWhere('publisherName', 'ilike', `%${name}%`)
          .orWhere('owner', 'ilike', `%${owner}%`)
          .orWhere('phone', 'ilike', `%${phone}%`)
          .orWhere('note', 'ilike', `%${note}%`)
      )
    }
    if (!isEmpty(genders)) sql.andWhere(qB => qB.whereIn('gender', genders))

    if (!isEmpty(languages))
      sql.andWhere(qB => qB.whereIn('idLanguage', languages))

    if (!isEmpty(status)) sql.andWhere(qB => qB.whereIn('idStatus', status))

    if (!isEmpty(locations)) {
      const someNull = some(isNil, locations)
      const cleanLocation = compact(locations)

      if (!isEmpty(cleanLocation) && someNull) {
        sql.andWhere(qB =>
          qB.whereIn('idLocation', cleanLocation).orWhereNull('idLocation')
        )
      } else if (someNull) sql.andWhere(qB => qB.whereNull('idLocation'))
      else sql.andWhere(qB => qB.whereIn('idLocation', cleanLocation))
    }

    if (typeCompany !== '-1')
      sql.andWhere(qB => qB.where('typeCompany', typeCompany))
  }
  return sql.orderByRaw(crud.parseOrderBy(sort)).paginate(perPage, currentPage)
}

const getGenders = async () =>
  knex
    .count('gender')
    .select('gender')
    .from(tableName)
    .groupBy('gender')

const getLanguages = async () =>
  knex
    .count('idLanguage')
    .select('idLanguage', 'languages.name as languageName')
    .from(tableName)
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .groupBy('idLanguage', 'languages.name')

const getStatus = async () =>
  knex
    .count('idStatus')
    .select('idStatus', 'status.description as statusDescription')
    .from(tableName)
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .groupBy('idStatus', 'status.description')

const getLocations = async () =>
  knex
    .select(
      'contacts.idLocation as value',
      knex.raw(`CONCAT(cities.name,' - ', departments.name) as label`)
    )
    .from(tableName)
    .leftJoin('cities', 'cities.id', '=', 'contacts.idLocation')
    .leftJoin('departments', 'departments.id', '=', 'cities.idDepartment')
    .groupBy('contacts.idLocation', 'cities.name', 'departments.name')
    .orderBy('cities.name')

const getType = async () => {
  const isTypeCompany = await knex
    .count('typeCompany')
    .select('typeCompany as typeCompanySelected')
    .from(tableName)
    .groupBy('typeCompany')

  const typeBoth = reduce(
    (acc, isCompany) => acc + Number(isCompany.count),
    0,
    isTypeCompany
  )
  const typeCompany = concat(isTypeCompany, {
    count: typeBoth,
    typeCompanySelected: '-1'
  })
  return map(
    option => ({
      ...option,
      typeCompanySelected: String(Number(option.typeCompanySelected))
    }),
    typeCompany
  )
}
const getFilters = async () => {
  const genders = await getGenders()
  const languages = await getLanguages()
  const status = await getStatus()
  const locations = await getLocations()
  const typeCompany = await getType()

  return {
    genders,
    languages,
    status,
    locations,
    typeCompany
  }
}

const getOneWithDetails = async phone =>
  knex
    .select(
      'contacts.name',
      'contacts.owner',
      'contacts.phone',
      'contacts.phone2',
      'contacts.idStatus',
      'contacts.gender',
      'contacts.idLanguage',
      'contacts.typeCompany',
      'contacts.idLocation',
      'contacts.email',
      'contacts.note',
      'detailsContacts.*'
    )
    .from(tableName)
    .leftJoin(
      'detailsContacts',
      'detailsContacts.phoneContact',
      '=',
      'contacts.phone'
    )
    .where(columnPrimary, '=', phone)

const createRecord = async data => crud.createRecord(data, tableName)

const updateRecord = async ({ id, data }) =>
  crud.updateRecord({ id, data, tableName, columnPrimary })

async function deleteRecord(id) {
  await detailsContact.deleteRecordByPhone(id)
  return crud.deleteRecord({ id, tableName, columnPrimary })
}

const getSummaryTotals = async userId => {
  const totalContacts = await knex(tableName)
    .count('phone')
    .first()

  const totalContactsByType = await knex(tableName)
    .count('phone')
    .select('typeCompany')
    .groupBy('typeCompany')

  const totalContactsByGender = await knex(tableName)
    .count('gender')
    .select('gender')
    .where('typeCompany', false)
    .groupBy('gender')

  const totalContactsNotCompanyContacted = await knex('detailsContacts')
    .countDistinct('phone')
    .leftJoin('contacts', 'contacts.phone', '=', 'detailsContacts.phoneContact')
    .where('contacts.typeCompany', false)
    .whereNot({ information: WAITING_FEEDBACK })
    .first()

  const totalContactsByGenderContacted = await knex('detailsContacts')
    .countDistinct('phone')
    .select('gender')
    .leftJoin('contacts', 'contacts.phone', '=', 'detailsContacts.phoneContact')
    .where('contacts.typeCompany', false)
    .whereNot({ information: WAITING_FEEDBACK })
    .groupBy('contacts.gender')

  const totalContactsByLanguage = await knex(tableName)
    .count('phone')
    .select(
      'languages.name as languageName',
      'languages.color as languageColor'
    )
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .groupBy('languages.name', 'languages.color')

  const totalContactsByLanguageContacted = await knex('detailsContacts')
    .countDistinct('contacts.phone')
    .select(
      'languages.name as languageName',
      'languages.color as languageColor'
    )
    .leftJoin('contacts', 'contacts.phone', '=', 'detailsContacts.phoneContact')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .whereNot({ information: WAITING_FEEDBACK })
    .groupBy('languages.name', 'languages.color')

  const totalContactsContacted = await knex('detailsContacts')
    .countDistinct('phoneContact')
    .whereNot({ information: WAITING_FEEDBACK })
    .first()

  const totalContactsAssignByMeWaitingFeedback = await knex('detailsContacts')
    .countDistinct('phoneContact')
    .where({ information: WAITING_FEEDBACK, createdBy: userId })
    .first()

  const totalContactsWaitingFeedback = await knex('detailsContacts')
    .countDistinct('phoneContact')
    .where({ information: WAITING_FEEDBACK })
    .first()

  const totalsContactsWaitingFeedbackByPublisher = await knex('detailsContacts')
    .count('phoneContact as count')
    .select('publishers.name as publisherName')
    .leftJoin('publishers', 'publishers.id', '=', 'detailsContacts.createdBy')
    .where({ information: WAITING_FEEDBACK })
    .groupBy('publishers.name')

  const totalContactsByLocation = await knex(tableName)
    .count('phone')
    .select('cities.name as locationName', 'departments.name as departmentName')
    .leftJoin('cities', 'cities.id', '=', 'contacts.idLocation')
    .leftJoin('departments', 'departments.id', '=', 'cities.idDepartment')
    .groupBy('cities.name', 'departments.name')

  const totalContactsByLocationContacted = await knex('detailsContacts')
    .countDistinct('contacts.phone')
    .select('cities.name as locationName', 'departments.name as departmentName')
    .leftJoin('contacts', 'contacts.phone', '=', 'detailsContacts.phoneContact')
    .leftJoin('cities', 'cities.id', '=', 'contacts.idLocation')
    .leftJoin('departments', 'departments.id', '=', 'cities.idDepartment')
    .whereNot({ information: WAITING_FEEDBACK })
    .groupBy('cities.name', 'departments.name')

  return {
    totalContacts,
    totalContactsContacted,
    totalContactsAssignByMeWaitingFeedback,
    totalContactsWaitingFeedback,
    totalsContactsWaitingFeedbackByPublisher,
    totalContactsByGender,
    totalContactsByGenderContacted,
    totalContactsByLanguage,
    totalContactsByLanguageContacted,
    totalContactsNotCompanyContacted,
    totalContactsByType,
    totalContactsByLocation,
    totalContactsByLocationContacted
  }
}

const contactsWithSamePhones = async (phone, phone2) => {
  const sql = knex(tableName)
    .select('name', 'phone', 'phone2')
    .where('phone2', phone)
  if (phone2) sql.orWhere('phone', phone2)
  return sql.first()
}

export {
  createRecord,
  updateRecord,
  deleteRecord,
  getAll,
  getOneWithDetails,
  getSummaryTotals,
  getFilters,
  contactsWithSamePhones,
  columnPrimary,
  fields
}
