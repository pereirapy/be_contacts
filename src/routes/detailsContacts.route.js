import { Router } from 'express'

import detailsContactsController from '../controllers/detailsContacts.controller'

const routes = Router()

routes.get('/', detailsContactsController.get)
routes.get('/oneContact/:id', detailsContactsController.getDetailsOneContact)
routes.get('/waitingFeedback', detailsContactsController.getAllWaitingFeedback)
routes.get(
  '/filtersWaitingFeedback',
  detailsContactsController.getAllFiltersWaitingFeedback
)
routes.get(
  '/campaign/hasSomeContact/:id',
  detailsContactsController.hasSomeContactDuringTheCampaign
)
routes.get('/:id', detailsContactsController.getOne)

routes.post('/', detailsContactsController.create)
routes.put('/:id', detailsContactsController.update)
routes.delete('/:id', detailsContactsController.deleteOne)

export default routes
