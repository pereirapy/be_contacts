import knex from '../config/connection'
import crud from './crudGeneric.model'
import { isNil, isEmpty, map, reduce, concat } from 'lodash/fp'
import { WAITING_FEEDBACK } from '../shared/constants/contacts.constant'
import { MINISTERIAL_SERVANT } from '../shared/constants/permissions.constant'

const tableName = 'detailsContacts'
const columnPrimary = 'id'
const fields = [
  'createdAt',
  'information',
  'idPublisher',
  'phoneContact',
  'createdBy',
  'updatedBy'
]

const getDetailsOneContact = async ({ id, query }) => {
  const { sort, perPage, currentPage, filters, limit } = query
  const sql = knex
    .select(
      'detailsContacts.information',
      knex.raw(
        `"detailsContacts"."information"='${WAITING_FEEDBACK}' as "waitingFeedback"`
      ),
      'detailsContacts.createdAt',
      'detailsContacts.idPublisher',
      'detailsContacts.id',
      'contacts.name',
      'contacts.owner',
      'contacts.idLanguage',
      'contacts.idLocation',
      'contacts.gender',
      'contacts.typeCompany',
      'publishers.name as publisherName'
    )
    .from(tableName)
    .leftJoin('publishers', 'detailsContacts.idPublisher', '=', 'publishers.id')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .where('phoneContact', '=', id)

  if (!isNil(limit) && limit > 0)
    return sql.limit(limit).orderByRaw(crud.parseOrderBy(sort))
  else if (!isEmpty(filters)) {
    const { publisher, details } = JSON.parse(filters)

    if (!isEmpty(publisher) && !isEmpty(details)) {
      sql.where(builder =>
        builder
          .where('detailsContacts.information', 'ilike', `%${details}%`)
          .orWhere('publishers.name', 'ilike', `%${publisher}%`)
      )
    }
    return sql
      .orderByRaw(crud.parseOrderBy(sort))
      .paginate(perPage, currentPage)
  }
  return sql
}

const getDetailsIsWaitingFeedbackOneContact = async phoneContact =>
  knex
    .select('detailsContacts.id')
    .from(tableName)
    .where('phoneContact', '=', phoneContact)
    .where('information', WAITING_FEEDBACK)

const getIDLastDetailsContactOneContact = async phoneContact =>
  knex
    .select('id')
    .from(tableName)
    .where('phoneContact', '=', phoneContact)
    .orderBy('id', 'desc')
    .first()

const getOne = async id =>
  knex
    .select(
      'detailsContacts.*',
      'publishers.name as publisherName',
      'contacts.idStatus',
      'contacts.idLanguage',
      'contacts.idLocation',
      'contacts.name',
      'contacts.owner',
      'contacts.gender',
      'contacts.typeCompany'
    )
    .from(tableName)
    .leftJoin('publishers', 'detailsContacts.idPublisher', '=', 'publishers.id')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .where('detailsContacts.id', id)
    .first()

const getDetailsAllContact = async () =>
  knex
    .select()
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')

const getDetailsAllContactWaitingFeedback = async ({ query, user }) => {
  const { sort, perPage, currentPage, filters } = query
  const { idResponsibility } = user
  const sql = knex
    .select(
      'id',
      'information',
      'createdAt',
      'createdBy',
      'idPublisher',
      'publisherNameCreatedBy',
      'publisherName',
      'languageName',
      'statusDescription',
      'contactName',
      'gender',
      'owner',
      'idStatus',
      'idLanguage',
      'phone',
      'typeCompany',
      'waitingFeedback'
    )
    .from('viewListContactsWaitingFeedback')

  if (idResponsibility < MINISTERIAL_SERVANT) {
    sql.where(builder =>
      builder.where('createdBy', user.id).orWhere('idPublisher', user.id)
    )
  }

  if (!isEmpty(filters)) {
    const {
      name,
      owner,
      phone,
      note,
      responsible,
      creator,
      genders,
      languages,
      status,
      typeCompany,
      publishersResponsibles
    } = JSON.parse(filters)

    if (
      !isEmpty(name) &&
      !isEmpty(owner) &&
      !isEmpty(phone) &&
      !isEmpty(creator) &&
      !isEmpty(responsible) &&
      !isEmpty(note)
    ) {
      sql.where(builder =>
        builder
          .where('contactName', 'ilike', `%${name}%`)
          .orWhere('owner', 'ilike', `%${owner}%`)
          .orWhere('phone', 'ilike', `%${phone}%`)
          .orWhere('note', 'ilike', `%${note}%`)
          .orWhere('publisherName', 'ilike', `%${responsible}%`)
      )
    }
    if (!isEmpty(genders)) sql.andWhere(qB => qB.whereIn('gender', genders))

    if (!isEmpty(languages))
      sql.andWhere(qB => qB.whereIn('idLanguage', languages))

    if (!isEmpty(status)) sql.andWhere(qB => qB.whereIn('idStatus', status))
    if (!isEmpty(publishersResponsibles))
      sql.andWhere(qB => qB.whereIn('createdBy', publishersResponsibles))

    if (typeCompany !== '-1')
      sql.andWhere(qB => qB.where('typeCompany', typeCompany))
  }
  return sql.orderByRaw(crud.parseOrderBy(sort)).paginate(perPage, currentPage)
}

const getGenders = async user => {
  const sql = knex
    .count('gender')
    .select('gender')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('gender')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where(builder =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  return sql
}

const getLanguages = async user => {
  const sql = knex
    .count('idLanguage')
    .select('idLanguage', 'languages.name as languageName')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('idLanguage', 'languages.name')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where(builder =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  sql.orderBy('idLanguage')

  return sql
}

const getStatus = async user => {
  const sql = knex
    .count('idStatus')
    .select('idStatus', 'status.description as statusDescription')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('idStatus', 'status.description')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where(builder =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  sql.orderBy('idStatus')

  return sql
}
const getPublishersResponsibles = async user => {
  const sql = knex
    .count('detailsContacts.createdBy')
    .select(
      'detailsContacts.createdBy',
      'publishers.name as publisherNameCreatedBy'
    )
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('publishers', 'detailsContacts.createdBy', '=', 'publishers.id')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('detailsContacts.createdBy', 'publishers.name')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where(builder =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  sql.orderBy('publishers.name')
  return sql
}

const getType = async user => {
  const sql = knex
    .count('typeCompany')
    .select('typeCompany as typeCompanySelected')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .groupBy('typeCompany')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where(builder =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }

  const isTypeCompany = await sql

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

const getFiltersWaitingFeedback = async ({ user }) => {
  const genders = await getGenders(user)
  const languages = await getLanguages(user)
  const status = await getStatus(user)
  const publishersResponsibles = await getPublishersResponsibles(user)
  const typeCompany = await getType(user)

  return { genders, languages, status, publishersResponsibles, typeCompany }
}

const createRecord = async data => crud.createRecord(data, tableName)

const updateRecord = async ({ id, data }) =>
  crud.updateRecord({ id, data, tableName, columnPrimary })

const updateRecords = async ({ where, data }) =>
  crud.updateRecords({ data, tableName, where })

const deleteRecord = async id =>
  crud.deleteRecord({ id, tableName, columnPrimary })

const deleteRecords = async where => crud.deleteRecords({ where, tableName })

const deleteRecordByPhone = phone =>
  knex(tableName)
    .where('phoneContact', '=', phone)
    .delete()

export {
  getOne,
  getDetailsAllContactWaitingFeedback,
  getFiltersWaitingFeedback,
  getDetailsOneContact,
  getDetailsAllContact,
  getDetailsIsWaitingFeedbackOneContact,
  getIDLastDetailsContactOneContact,
  createRecord,
  updateRecord,
  updateRecords,
  deleteRecord,
  deleteRecords,
  deleteRecordByPhone,
  columnPrimary,
  fields
}
