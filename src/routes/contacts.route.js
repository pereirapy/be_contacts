import { Router } from 'express'
import contactsGraphQLController from '../controllers/contacts/contacts.graphql.controller'
import contactsController from '../controllers/contacts/contacts.controller'

const routes = Router()

routes.get('/:id/summary', contactsController.getSummaryOneCampaign)
routes.get('/summary', contactsController.getSummaryContacts)
routes.get('/filters', contactsController.getAllFiltersOfContacts)
routes.get('/:id', contactsController.getOne)

routes.post('/', contactsController.create)
routes.post('/assign', contactsController.assign)
routes.post('/backup', contactsController.backup)

routes.put('/some', contactsController.updateSome)
routes.put('/:id', contactsController.update)

routes.delete('/assign', contactsController.cancelAssign)
routes.delete('/:id', contactsController.deleteOne)

routes.get('/', contactsGraphQLController)

export default routes
