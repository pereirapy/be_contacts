import { Router } from 'express'
import locationsController from '../controllers/locations.controller'

const routes = Router()

routes.get('/', locationsController.get)

export default routes
