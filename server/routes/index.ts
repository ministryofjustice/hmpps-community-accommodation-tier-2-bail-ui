/* istanbul ignore file */

import { Router } from 'express'
import { Controllers } from '../controllers'
import paths from '../paths/apply'
import { Services } from '../services'
import applyRoutes from './apply'
import assessRoutes from './assess'
import reportRoutes from './report'
import staticRoutes from './static'
import { actions } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(controllers: Controllers, services: Services): Router {
  const router = Router()
  const { get, post } = actions(router, services.auditService)

  const { dashboardController } = controllers

  get('/', dashboardController.index(), { auditEvent: 'VIEW_DASHBOARD' })

  const { peopleController } = controllers

  post(paths.applications.people.findByPrisonNumber.pattern, peopleController.findByPrisonNumber(), {
    auditEvent: 'FIND_APPLICATION_PERSON_BY_PRISON_NUMBER',
    auditBodyParams: ['prisonNumber'],
  })

  post(paths.applications.people.findByCrn.pattern, peopleController.findByCrn(), {
    auditEvent: 'FIND_APPLICATION_PERSON_BY_CRN',
    auditBodyParams: ['crn'],
  })

  applyRoutes(controllers, router, services)
  assessRoutes(controllers, router, services)
  reportRoutes(controllers, router, services)
  staticRoutes(controllers, router, services)

  return router
}
