/* istanbul ignore file */

import type { Router } from 'express'

import type { Controllers } from '../controllers'
import paths from '../paths/static'
import { Services } from '../services'
import { actions } from './utils'

export default function staticRoutes(controllers: Controllers, router: Router, services: Services): Router {
  const { get } = actions(router, services.auditService)

  const { staticController } = controllers

  get(paths.static.maintenancePage.pattern, staticController.maintenancePage(), {})
  get(paths.static.privacyNotice.pattern, staticController.privacyNoticePage(), {})
  get(paths.static.cookiesPolicy.pattern, staticController.cookiesPolicyPage(), {})
  get(paths.static.accessibilityStatement.pattern, staticController.accessibilityStatementPage(), {})
  get(paths.static.interviewQuestionsHtml.pattern, staticController.interviewQuestionsHtml(), {})
  get(paths.static.interviewQuestionsDocx.pattern, staticController.interviewQuestionsDocx(), {})

  return router
}
