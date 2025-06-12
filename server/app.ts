import express from 'express'
import flash from 'connect-flash'
import methodOverride from 'method-override'

import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import authorisationMiddleware from './middleware/authorisationMiddleware'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import setUpMaintenancePageRedirect from './middleware/setUpMaintenancePageRedirect'
import setUpProductInfo from './middleware/setUpProductInfo'
import { setUpSentryRequestHandler, setUpSentryErrorHandler } from './middleware/setUpSentry'

import { Controllers } from './controllers'
import routes from './routes'
import type { Services } from './services'

export default function createApp(controllers: Controllers, services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  // Add method-override to allow us to use PUT and DELETE methods
  app.use(methodOverride('_method'))

  setUpSentryRequestHandler(app)

  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpProductInfo())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services.userService))

  app.use(setUpMaintenancePageRedirect())
  app.use((req, res, next) => {
    res.locals.infoMessages = req.flash('info')
    res.locals.successMessages = req.flash('success')
    return next()
  })
  app.use(flash())

  app.use(routes(controllers, services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  setUpSentryErrorHandler(app)

  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
