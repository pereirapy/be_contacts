import { Router } from 'express'
import permissionsController from '../controllers/permissions.controller'

const routes = Router()

routes.get('/', permissionsController.get)
routes.post('/', permissionsController.create)
routes.put('/:id', permissionsController.update)
routes.delete('/:id', permissionsController.deleteOne)

export default routes
