import { Router } from 'express'
import campaignsController from '../controllers/campaigns.controller'

const routes = Router()

routes.get('/', campaignsController.get)
routes.get('/active/details', campaignsController.getDetailsCampaignActive)
routes.get('/:id/all', campaignsController.getAllContactsOneCampaign)
routes.get('/:id/all/filters', campaignsController.getAllContactsOneCampaignFilters)
routes.get('/:id', campaignsController.getOne)
routes.post('/', campaignsController.create)
routes.put('/:id', campaignsController.update)
routes.delete('/:id', campaignsController.deleteOne)

export default routes
