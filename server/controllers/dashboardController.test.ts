import { ServiceSection } from 'server/@types/ui'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import { sectionsForUser } from '../utils/userUtils'

import DashboardController from './dashboardController'

jest.mock('../utils/userUtils')

describe('DashboardController', () => {
  const request: DeepMocked<Request> = createMock<Request>({})
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  let dashboardController: DashboardController

  beforeEach(() => {
    dashboardController = new DashboardController()
  })

  describe('index', () => {
    const sections = createMock<Array<ServiceSection>>()
    ;(sectionsForUser as jest.Mock).mockReturnValue(sections)

    const expectedRenderParameters = {
      pageHeading: 'CAS2 for bail',
      sections,
      typesOfApplications: [
        'Bail',
        'Homeless at Conditional Release Date (HCRD)',
        'Homeless following Fixed Term Recall (HFTR)',
        'Risk Assessed Recall Review (RARR)',
        'Move-on from Approved Premises (CAS1)',
        'Alternative to Custodial Recall (ATCR)',
        'Intensive Supervision Courts (ISC)',
      ],
    }

    it('should render the dashboard template', () => {
      const response = createMock<Response>({ locals: { user: { userRoles: 'CAS2_MI' } } })

      const requestHandler = dashboardController.index()

      requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('dashboard/index', {
        ...expectedRenderParameters,
        isReferrer: false,
      })
    })

    it('should render the dashboard for a court bail referrer', () => {
      const response = createMock<Response>({ locals: { user: { userRoles: 'CAS2_COURT_BAIL_REFERRER' } } })

      const requestHandler = dashboardController.index()

      requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('dashboard/index', {
        ...expectedRenderParameters,
        isReferrer: true,
      })
    })

    it('should render the dashboard template for a prison bail referrer', () => {
      const response = createMock<Response>({ locals: { user: { userRoles: 'CAS2_PRISON_BAIL_REFERRER' } } })

      const requestHandler = dashboardController.index()

      requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('dashboard/index', {
        ...expectedRenderParameters,
        isReferrer: true,
      })
    })
  })
})
