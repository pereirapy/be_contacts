import { Router } from 'express'
import publishersController from '../controllers/publishers.controller'

const routes = Router()

routes.get(
  '/withPagination',
  publishersController.getAllInformationWithPagination
)
routes.get('/filters', publishersController.getAllFiltersOfPublishers)

routes.get('/actives', publishersController.getAllActives)

routes.get('/', publishersController.get)

routes.get('/:id', publishersController.getOne)

routes.post('/', publishersController.create)

routes.put('/:id', publishersController.update)

routes.delete('/:id', publishersController.deleteOne)

export default routes
