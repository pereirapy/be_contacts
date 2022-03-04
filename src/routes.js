import { Router } from 'express'
import authGuard from './shared/middleware/authGuard.middleware'
import contacts from './routes/contacts.route'
import publishers from './routes/publishers.route'
import status from './routes/status.route'
import campaigns from './routes/campaigns.route'
import responsibility from './routes/responsibility.route'
import detailsContacts from './routes/detailsContacts.route'
import locations from './routes/locations.route'
import languages from './routes/languages.route'
import permissions from './routes/permissions.route'
import auth from './routes/auth.route'
import reAuth from './routes/reAuth.route'
import { permissionGuard } from './shared/middleware/permissions.middleware'

const routes = Router()

routes.use('/auth', auth)
routes.use('/reauth', authGuard, reAuth)
routes.use('/permissions', authGuard, permissionGuard, permissions)
routes.use('/contacts', authGuard, permissionGuard, contacts)
routes.use('/publishers', authGuard, permissionGuard, publishers)
routes.use('/status', authGuard, permissionGuard, status)
routes.use('/campaigns', authGuard, permissionGuard, campaigns)
routes.use('/detailsContacts', authGuard, permissionGuard, detailsContacts)
routes.use('/languages', authGuard, permissionGuard, languages)
routes.use('/responsibility', authGuard, permissionGuard, responsibility)
routes.use('/locations', authGuard, locations)

export default routes
