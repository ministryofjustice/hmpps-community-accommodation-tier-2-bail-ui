import express, { type Express } from 'express'
import createError from 'http-errors'
import request from 'supertest'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'

let app: Express

const setupApp = (isProduction: boolean): Express => {
  app = express()
  app.set('view engine', 'njk')

  nunjucksSetup(app)

  app.get('/known', (_req, res, _next) => {
    res.send('known')
  })
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(isProduction))

  return app
}

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render content with stack in dev mode', () => {
    app = setupApp(false)
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Not found')
        expect(res.text).not.toContain('Something went wrong. The error has been logged. Please try again')
      })
  })

  it('should render content without stack in production mode', () => {
    app = setupApp(true)

    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Something went wrong. The error has been logged. Please try again')
        expect(res.text).not.toContain('NotFoundError: Not Found')
      })
  })
})
