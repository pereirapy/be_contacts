import { Router } from 'express'
import statusController from '../controllers/status.controller'

const routes = Router()

routes.get('/', statusController.get)
routes.post('/', statusController.create)
routes.put('/:id', statusController.update)
routes.delete('/:id', statusController.deleteOne)

export default routes
