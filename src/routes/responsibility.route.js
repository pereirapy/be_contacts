import { Router } from 'express'
import responsibilityController from '../controllers/responsibility.controller'

const routes = Router()

routes.get('/', responsibilityController.get)

export default routes
