import { Router } from 'express'
import authController from '../controllers/auth.controller'

const routes = Router()

routes.post('/', authController.authenticate)

export default routes
