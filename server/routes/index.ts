import { Router } from 'express'

import type { Services } from '../services'
import { Controllers } from '../controllers'
import paths from '../paths/apply'
import applyRoutes from './apply'
import assessRoutes from './assess'
import reportRoutes from './report'
import staticRoutes from './static'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(controllers: Controllers, services: Services): Router {
  const router = Router()
  const { get, post } = actions(router)

  const { dashboardController, peopleController } = controllers

  get('/', dashboardController.index())

  post(paths.applications.people.find.pattern, peopleController.find(), {
    auditEvent: 'FIND_APPLICATION_PERSON',
    auditBodyParams: ['prisonNumber'],
  })

  applyRoutes(controllers, router, services)
  assessRoutes(controllers, router, services)
  reportRoutes(controllers, router, services)
  staticRoutes(controllers, router, services)

  return router
}
