import type { NextFunction, Request, Response } from 'express'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { ApplicationOrigin } from '@approved-premises/ui'

import PeopleController from './peopleController'
import { errorMessage, errorSummary } from '../utils/validation'
import PersonService from '../services/personService'
import ApplicationService from '../services/applicationService'
import { fullPersonFactory } from '../testutils/factories/person'
import applicationFactory from '../testutils/factories/application'
import { DateFormats } from '../utils/dateUtils'
import paths from '../paths/apply'

jest.mock('../utils/viewUtils')

describe('peopleController', () => {
  const flashSpy = jest.fn()
  const token = 'SOME_TOKEN'
  const prisonNumber = '1234'
  const applicationOrigin: ApplicationOrigin = 'prisonBail'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  const personService = createMock<PersonService>({})
  const applicationService = createMock<ApplicationService>({})

  let peopleController: PeopleController

  beforeEach(() => {
    peopleController = new PeopleController(applicationService, personService)
    request = createMock<Request>({
      body: { prisonNumber, applicationOrigin },
      user: { token },
      flash: flashSpy,
      headers: {
        referer: 'some-referer/',
      },
    })
    response = createMock<Response>({})
    jest.clearAllMocks()
  })

  describe('findByPrisonNumber', () => {
    describe('when there is a prison number', () => {
      it('redirects to the show applications path', async () => {
        const requestHandler = peopleController.findByPrisonNumber()

        const person = fullPersonFactory.build({})

        personService.findByPrisonNumber.mockResolvedValue(person)
        applicationService.createApplication.mockResolvedValue(applicationFactory.build({ id: '123abc' }))

        await requestHandler(request, response, next)

        expect(response.render).toHaveBeenCalledWith('people/confirm-applicant-details', {
          pageHeading: `Confirm ${person.name}'s details`,
          person,
          date: DateFormats.dateObjtoUIDate(new Date()),
          dateOfBirth: DateFormats.isoDateToUIDate(person.dateOfBirth, { format: 'short' }),
          applicationOrigin,
        })
      })

      describe('when there are errors', () => {
        describe('when there is a 404 error', () => {
          it('renders the search-by-prison-number page with a not found error message', async () => {
            const requestHandler = peopleController.findByPrisonNumber()

            const err = { data: {}, status: 404 }

            personService.findByPrisonNumber.mockImplementation(() => {
              throw err
            })

            request.body.prisonNumber = 'SOME_NUMBER'

            await requestHandler(request, response, next)

            expect(request.flash).toHaveBeenCalledWith('errors', {
              prisonNumber: errorMessage(
                'prisonNumber',
                `No person found for prison number ${request.body.prisonNumber}, please try another number.`,
              ),
            })
            expect(request.flash).toHaveBeenCalledWith('errorSummary', [
              errorSummary(
                'prisonNumber',
                `No person found for prison number ${request.body.prisonNumber}, please try another number.`,
              ),
            ])
            expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByPrisonNumber({}))
          })
        })

        describe('when there is a 403 error', () => {
          it('renders the search-by-prison-number page with a permissions error message', async () => {
            const requestHandler = peopleController.findByPrisonNumber()

            const err = { data: {}, status: 403 }

            personService.findByPrisonNumber.mockImplementation(() => {
              throw err
            })

            request.body.prisonNumber = 'SOME_NUMBER'

            await requestHandler(request, response, next)

            expect(request.flash).toHaveBeenCalledWith('errors', {
              prisonNumber: errorMessage(
                'prisonNumber',
                'You do not have permission to access the prison number SOME_NUMBER, please try another number.',
              ),
            })
            expect(request.flash).toHaveBeenCalledWith('errorSummary', [
              errorSummary(
                'prisonNumber',
                'You do not have permission to access the prison number SOME_NUMBER, please try another number.',
              ),
            ])
            expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByPrisonNumber({}))
          })
        })

        describe('when there is an error of another type', () => {
          it('renders the search-by-prison-number page with a generic error message', async () => {
            const requestHandler = peopleController.findByPrisonNumber()

            const err = { data: {}, status: 500 }

            personService.findByPrisonNumber.mockImplementation(() => {
              throw err
            })

            request.body.nomsNumber = 'SOME_NUMBER'

            await requestHandler(request, response, next)

            expect(request.flash).toHaveBeenCalledWith('errors', {
              prisonNumber: errorMessage('prisonNumber', 'Something went wrong. Please try again later.'),
            })
            expect(request.flash).toHaveBeenCalledWith('errorSummary', [
              errorSummary('prisonNumber', 'Something went wrong. Please try again later.'),
            ])
            expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByPrisonNumber({}))
          })
        })
      })
    })

    describe('when there is not a prison number', () => {
      it('renders the search-by-prison-number page with an error message', async () => {
        request.body = {}

        const requestHandler = peopleController.findByPrisonNumber()

        await requestHandler(request, response, next)

        expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByPrisonNumber({}))

        expect(flashSpy).toHaveBeenCalledWith('errors', {
          prisonNumber: errorMessage('prisonNumber', 'Enter a prison number'),
        })
        expect(flashSpy).toHaveBeenCalledWith('errorSummary', [errorSummary('prisonNumber', 'Enter a prison number')])
      })
    })
  })
})
