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

    it('should render the dashboard template', () => {
      const response = createMock<Response>()

      const requestHandler = dashboardController.index()

      requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('dashboard/index', {
        pageHeading: 'CAS-2: Short-Term Accommodation',
        sections,
      })
    })
  })
})
