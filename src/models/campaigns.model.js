import knex from '../config/connection'
import crud from './crudGeneric.model'
import { isEmpty, map, reduce, concat, isNil, some, compact } from 'lodash/fp'
import { MINISTERIAL_SERVANT } from '../shared/constants/permissions.constant'
import moment from 'moment'

const tableName = 'campaigns'
const columnPrimary = 'id'
const fields = ['name', 'dateStart', 'dateFinal']

const getAll = async (queryParams) => crud.getAll(tableName, queryParams)

const getOne = async (id) => crud.getOneRecord({ id, tableName, columnPrimary })

const buildSQLGetAll = (idCampaign, queryParams) => {
  if (!idCampaign) return

  const { filters } = queryParams
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
      'lastConversationInDays',
      'publisherName',
      'information',
      'waitingFeedback',
      'createdAtDetailsContacts',
      'updatedAt',
      'publisherNameUpdatedBy',
      'idCampaign',
      'campaignName',
      'campaignDateStart',
      'campaignDateFinal'
    )
    .from('viewListAllContacts')
  sql.whereNotNull('phone').andWhere('idCampaign', idCampaign)

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
      typeCompany,
    } = JSON.parse(filters)

    if (
      !isEmpty(name) &&
      !isEmpty(phone) &&
      !isEmpty(note) &&
      !isEmpty(owner)
    ) {
      sql.andWhere((builder) =>
        builder
          .where('name', 'ilike', `%${name}%`)
          .orWhere('publisherName', 'ilike', `%${name}%`)
          .orWhere('owner', 'ilike', `%${owner}%`)
          .orWhere('phone', 'ilike', `%${phone}%`)
          .orWhere('note', 'ilike', `%${note}%`)
      )
    }

    if (!isEmpty(genders)) sql.andWhere((qB) => qB.whereIn('gender', genders))

    if (!isEmpty(languages))
      sql.andWhere((qB) => qB.whereIn('idLanguage', languages))

    if (!isEmpty(status)) sql.andWhere((qB) => qB.whereIn('idStatus', status))

    if (!isEmpty(locations)) {
      const someNull = some(isNil, locations)
      const cleanLocation = compact(locations)

      if (!isEmpty(cleanLocation) && someNull) {
        sql.andWhere((qB) =>
          qB.whereIn('idLocation', cleanLocation).orWhereNull('idLocation')
        )
      } else if (someNull) sql.andWhere((qB) => qB.whereNull('idLocation'))
      else sql.andWhere((qB) => qB.whereIn('idLocation', cleanLocation))
    }

    if (typeCompany !== '-1')
      sql.andWhere((qB) => qB.where('typeCompany', typeCompany))
  }

  return sql
}

const getAllContactsOneCampaign = async ({ id, query }) => {
  const { sort = 'lastConversationInDays:DESC', perPage, currentPage } = query
  return buildSQLGetAll(id, query)
    .orderByRaw(crud.parseOrderBy(sort))
    .paginate(perPage, currentPage)
}

const getDetailsCampaignActive = async () =>
  knex
    .select('*')
    .from(tableName)
    .where('dateStart', '<=', moment().format('YYYY-MM-DD'))
    .andWhere('dateFinal', '>=', moment().format('YYYY-MM-DD'))
    .first()

const getCampaignByIntervalDate = async (dateStart, dateFinal) =>
  knex
    .select('*')
    .from(tableName)
    .whereBetween('dateStart', [dateStart, dateFinal])
    .orWhereBetween('dateFinal', [dateStart, dateFinal])
    .orWhere((builder) =>
      builder
        .where('dateStart', '<=', dateStart)
        .andWhere('dateFinal', '>=', dateStart)
    )
    .first()

const createRecord = async (data) => crud.createRecord(data, tableName)

const updateRecord = async ({ id, data }) =>
  crud.updateRecord({ id, data, tableName, columnPrimary })

const deleteRecord = async (id) =>
  crud.deleteRecord({ id, tableName, columnPrimary })

const getGenders = async (user, idCampaign) => {
  const sql = knex
    .count('gender')
    .select('gender')
    .from('detailsContacts')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .where('detailsContacts.idCampaign', idCampaign)
    .groupBy('gender')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where((builder) =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  return sql
}

const getLanguages = async (user, idCampaign) => {
  const sql = knex
    .count('idLanguage')
    .select('idLanguage', 'languages.name as languageName')
    .from('detailsContacts')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .where('detailsContacts.idCampaign', idCampaign)
    .groupBy('idLanguage', 'languages.name')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where((builder) =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  sql.orderBy('idLanguage')

  return sql
}

const getStatus = async (user, idCampaign) => {
  const sql = knex
    .count('idStatus')
    .select('idStatus', 'status.description as statusDescription')
    .from('detailsContacts')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .where('detailsContacts.idCampaign', idCampaign)
    .groupBy('idStatus', 'status.description')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where((builder) =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  sql.orderBy('idStatus')

  return sql
}

const getPublishersResponsibles = async (user, idCampaign) => {
  const sql = knex
    .count('detailsContacts.createdBy')
    .select(
      'detailsContacts.createdBy',
      'publishers.name as publisherNameCreatedBy'
    )
    .from('detailsContacts')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('publishers', 'detailsContacts.createdBy', '=', 'publishers.id')
    .where('detailsContacts.idCampaign', idCampaign)
    .groupBy('detailsContacts.createdBy', 'publishers.name')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where((builder) =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  sql.orderBy('publishers.name')
  return sql
}

const getType = async (user, idCampaign) => {
  const sql = knex
    .count('typeCompany')
    .select('typeCompany as typeCompanySelected')
    .from('detailsContacts')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .where('detailsContacts.idCampaign', idCampaign)
    .groupBy('typeCompany')

  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.where((builder) =>
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
    typeCompanySelected: '-1',
  })
  return map(
    (option) => ({
      ...option,
      typeCompanySelected: String(Number(option.typeCompanySelected)),
    }),
    typeCompany
  )
}

const getLocations = async (user, idCampaign) => {
  const sql = knex
    .select(
      'contacts.idLocation as value',
      knex.raw(`CONCAT(cities.name,' - ', departments.name) as label`)
    )
    .from('detailsContacts')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('cities', 'cities.id', '=', 'contacts.idLocation')
    .leftJoin('departments', 'departments.id', '=', 'cities.idDepartment')
    .where('detailsContacts.idCampaign', idCampaign)
  if (user.idResponsibility < MINISTERIAL_SERVANT) {
    sql.andWhere((builder) =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }

  return sql
    .groupBy('contacts.idLocation', 'cities.name', 'departments.name')
    .orderBy('cities.name')
}

const getAllContactsOneCampaignFilters = async ({ user, id }) => {
  const genders = await getGenders(user, id)
  const languages = await getLanguages(user, id)
  const status = await getStatus(user, id)
  const locations = await getLocations(user, id)
  const typeCompany = await getType(user, id)
  const publishersResponsibles = await getPublishersResponsibles(user, id)

  return {
    genders,
    languages,
    status,
    locations,
    typeCompany,
    publishersResponsibles,
  }
}

const getAllContactsCampaignActiveFilters = async ({ user }) => {
  const campaignActiveID = await getDetailsCampaignActive()

  const genders = campaignActiveID?.id
    ? await getGenders(user, campaignActiveID.id)
    : []
  const languages = campaignActiveID?.id
    ? await getLanguages(user, campaignActiveID.id)
    : []
  const status = campaignActiveID?.id
    ? await getStatus(user, campaignActiveID.id)
    : []
  const locations = campaignActiveID?.id
    ? await getLocations(user, campaignActiveID.id)
    : []
  const typeCompany = campaignActiveID?.id
    ? await getType(user, campaignActiveID.id)
    : []
  const publishersResponsibles = campaignActiveID?.id
    ? await getPublishersResponsibles(user, campaignActiveID.id)
    : []

  return {
    genders,
    languages,
    status,
    locations,
    typeCompany,
    publishersResponsibles,
  }
}

export {
  getAll,
  getOne,
  createRecord,
  updateRecord,
  deleteRecord,
  getAllContactsOneCampaign,
  getAllContactsOneCampaignFilters,
  getAllContactsCampaignActiveFilters,
  getDetailsCampaignActive,
  getCampaignByIntervalDate,
  fields,
}
