import { Router } from 'express'
import reAuthController from '../controllers/reAuth.controller'

const routes = Router()

routes.post('/', reAuthController.reAuthenticate)

export default routes
