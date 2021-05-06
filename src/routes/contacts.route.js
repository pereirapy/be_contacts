import { Router } from 'express'
import contactsController from '../controllers/contacts.controller'

const routes = Router()

routes.get('/', contactsController.get)
routes.get('/summary', contactsController.getSummaryContacts)
routes.get('/filters', contactsController.getAllFiltersOfContacts)
routes.get('/:id', contactsController.getOne)

routes.post('/', contactsController.create)
routes.post('/assign', contactsController.assign)

routes.put('/some', contactsController.updateSome)
routes.put('/:id', contactsController.update)

routes.delete('/assign', contactsController.cancelAssign)
routes.delete('/:id', contactsController.deleteOne)

export default routes
