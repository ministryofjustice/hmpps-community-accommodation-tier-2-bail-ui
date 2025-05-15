import type { NextFunction, Request, Response } from 'express'
import { DeepMocked, createMock } from '@golevelup/ts-jest'

import ReportsController from './reportsController'
import ReportService from '../../services/reportService'
import paths from '../../paths/report'

jest.mock('../../utils/validation')

describe('reportsController', () => {
  const token = 'SOME_TOKEN'
  const name = 'submitted-applications'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  const reportService = createMock<ReportService>({})

  let reportsController: ReportsController

  beforeEach(() => {
    reportsController = new ReportsController(reportService)
    request = createMock<Request>({ user: { token }, params: { name } })
    response = createMock<Response>({})
    jest.clearAllMocks()
  })

  describe('new', () => {
    describe('when user has ROLE_MI', () => {
      it('renders the template', async () => {
        response.locals.user.userRoles = ['CAS2_MI', 'CAS2_ASSESSOR']

        const requestHandler = reportsController.new()

        await requestHandler(request, response, next)

        expect(response.render).toHaveBeenCalledWith('reports/new', {})
      })
    })

    describe('when user does not have ROLE_MI', () => {
      it('redirects to the unauthorised page', async () => {
        response.locals.user.userRoles = ['CAS2_COURT_BAIL_REFERRER', 'CAS2_ASSESSOR']

        const requestHandler = reportsController.new()

        await requestHandler(request, response, next)

        expect(response.redirect).toHaveBeenCalledWith(paths.report.unauthorised({}))
      })
    })
  })

  describe('create', () => {
    it('calls the service method with the name of the report to download', async () => {
      const requestHandler = reportsController.create()

      await requestHandler(request, response, next)

      expect(paths.report.create({ name })).toEqual('/reports/submitted-applications')

      expect(reportService.getReport).toHaveBeenCalledWith(name, token, response)
    })

    it('redirects back to new if there is an error', async () => {
      ;(reportService.getReport as jest.Mock).mockRejectedValue(new Error())

      const requestHandler = reportsController.create()

      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.report.new({}))
    })
  })

  describe('unauthorised', () => {
    it('renders the template', async () => {
      const requestHandler = reportsController.unauthorised()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('reports/unauthorised', {
        pageHeading: 'You are not authorised to view this page.',
      })
    })
  })
})
