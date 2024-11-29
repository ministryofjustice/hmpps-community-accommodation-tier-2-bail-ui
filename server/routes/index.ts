import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import RestClient from '../data/restClient'
import config, { ApiConfig } from '../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/index')
  })

  get('/demo-poc', async (req, res, next) => {
    const restClient = new RestClient(
      'applicationClient',
      config.apis.approvedPremises as ApiConfig,
      res.locals.user.token,
    )

    const apiRes = await restClient.get({ path: '/cas2/applications' })

    const templateData = {
      username: res.locals.user.username,
      correlationId: req.id,
      xxxx: 'Welcome to the Example Page',
      token: res.locals.user.token,
      status: JSON.stringify(apiRes),
    }

    res.render('pages/demo-poc', templateData)
  })

  return router
}
