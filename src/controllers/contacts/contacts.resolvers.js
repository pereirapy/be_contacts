import contactsService from '../../services/contacts.service'

const getAll = async ({ input }, { request }) =>
  contactsService.get({ input, request })

export default {
  getAll,
}
