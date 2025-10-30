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
  const crn = '4321'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  const personService = createMock<PersonService>({})
  const applicationService = createMock<ApplicationService>({})

  let peopleController: PeopleController

  beforeEach(() => {
    peopleController = new PeopleController(applicationService, personService)
    response = createMock<Response>({})
    jest.clearAllMocks()
  })

  describe('findByPrisonNumber', () => {
    beforeEach(() => {
      request = createMock<Request>({
        body: { prisonNumber, applicationOrigin },
        user: { token },
        flash: flashSpy,
        headers: {
          referer: 'some-referer/',
        },
      })
    })
    describe('when there is a prison number', () => {
      it('renders the confirm applicant details page', async () => {
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
                `No person found for prison number ${request.body.prisonNumber}. You can try again, or search using a different prison number or a case reference number (CRN)`,
              ),
            })
            expect(request.flash).toHaveBeenCalledWith('errorSummary', [
              errorSummary(
                'prisonNumber',
                `No person found for prison number ${request.body.prisonNumber}. You can try again, or search using a different prison number or a case reference number (CRN)`,
              ),
            ])
            expect(request.flash).toHaveBeenCalledWith('errorStatusCode', '404')
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

        describe('when the prison number is in an invalid format', () => {
          it('renders the search-by-prison-number page with a incorrect format error message', async () => {
            const requestHandler = peopleController.findByPrisonNumber()

            const err = { data: {}, status: 500 }

            personService.findByPrisonNumber.mockImplementation(() => {
              throw err
            })

            request.body.prisonNumber = 'A7779DY/23'

            await requestHandler(request, response, next)

            expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByPrisonNumber({}))
            expect(flashSpy).toHaveBeenCalledWith('errors', {
              prisonNumber: errorMessage('prisonNumber', 'Enter a prison number in the correct format'),
            })
            expect(flashSpy).toHaveBeenCalledWith('errorSummary', [
              errorSummary('prisonNumber', 'Enter a prison number in the correct format'),
            ])
          })
        })

        describe('when there is an error of another type', () => {
          it('renders the search-by-prison-number page with a generic error message', async () => {
            const requestHandler = peopleController.findByPrisonNumber()

            const err = { data: {}, status: 500 }

            personService.findByPrisonNumber.mockImplementation(() => {
              throw err
            })

            request.body.prisonNumber = 'SOMENUMBER'

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

  describe('findByCrn', () => {
    beforeEach(() => {
      request = createMock<Request>({
        body: { crn, applicationOrigin: 'courtBail' },
        user: { token },
        flash: flashSpy,
        headers: {
          referer: 'some-referer/',
        },
      })
    })
    describe('when there is a CRN', () => {
      it('renders the confirm applicant details page', async () => {
        const requestHandler = peopleController.findByCrn()

        const person = fullPersonFactory.build({})

        personService.findByCrn.mockResolvedValue(person)
        applicationService.createApplication.mockResolvedValue(applicationFactory.build({ id: '123abc' }))

        await requestHandler(request, response, next)

        expect(response.render).toHaveBeenCalledWith('people/confirm-applicant-details', {
          pageHeading: `Confirm ${person.name}'s details`,
          person,
          date: DateFormats.dateObjtoUIDate(new Date()),
          dateOfBirth: DateFormats.isoDateToUIDate(person.dateOfBirth, { format: 'short' }),
          applicationOrigin: 'courtBail',
        })
      })

      describe('when there are errors', () => {
        describe('when there is a 404 error', () => {
          it('renders a not found error message', async () => {
            const requestHandler = peopleController.findByCrn()

            const err = { data: {}, status: 404 }

            personService.findByCrn.mockImplementation(() => {
              throw err
            })

            request.body.crn = 'SOME_NUMBER'

            await requestHandler(request, response, next)

            expect(request.flash).toHaveBeenCalledWith('errors', {
              crn: errorMessage('crn', `No person found for CRN ${request.body.crn}, please try another number.`),
            })
            expect(request.flash).toHaveBeenCalledWith('errorSummary', [
              errorSummary('crn', `No person found for CRN ${request.body.crn}, please try another number.`),
            ])
            expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByCrn({}))
          })
        })

        describe('when there is a 403 error', () => {
          it('renders a permissions error message', async () => {
            const requestHandler = peopleController.findByCrn()

            const err = { data: {}, status: 403 }

            personService.findByCrn.mockImplementation(() => {
              throw err
            })

            request.body.crn = 'SOME_NUMBER'

            await requestHandler(request, response, next)

            expect(request.flash).toHaveBeenCalledWith('errors', {
              crn: errorMessage(
                'crn',
                'You do not have permission to access the CRN SOME_NUMBER, please try another number.',
              ),
            })
            expect(request.flash).toHaveBeenCalledWith('errorSummary', [
              errorSummary(
                'crn',
                'You do not have permission to access the CRN SOME_NUMBER, please try another number.',
              ),
            ])
            expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByCrn({}))
          })
        })

        describe('when the crn is in an invalid format', () => {
          it('renders the search-by-crn page with a incorrect format error message', async () => {
            const requestHandler = peopleController.findByCrn()

            const err = { data: {}, status: 500 }

            personService.findByCrn.mockImplementation(() => {
              throw err
            })

            request.body.crn = 'X371199/23'

            await requestHandler(request, response, next)

            expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByCrn({}))
            expect(flashSpy).toHaveBeenCalledWith('errors', {
              crn: errorMessage('crn', 'Enter a CRN in the correct format'),
            })
            expect(flashSpy).toHaveBeenCalledWith('errorSummary', [
              errorSummary('crn', 'Enter a CRN in the correct format'),
            ])
          })
        })

        describe('when there is an error of another type', () => {
          it('throws the error', async () => {
            const requestHandler = peopleController.findByCrn()

            const err = { data: {}, status: 500 }

            personService.findByCrn.mockImplementation(() => {
              throw err
            })

            request.body.crn = 'SOMENUMBER'

            await requestHandler(request, response, next)

            expect(request.flash).toHaveBeenCalledWith('errors', {
              crn: errorMessage('crn', 'Something went wrong. Please try again later.'),
            })
            expect(request.flash).toHaveBeenCalledWith('errorSummary', [
              errorSummary('crn', 'Something went wrong. Please try again later.'),
            ])
            expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByCrn({}))
          })
        })
      })
    })

    describe('when there is not a CRN', () => {
      it('sends an error to the flash if a CRN has not been provided', async () => {
        request.body = {}

        const requestHandler = peopleController.findByCrn()

        await requestHandler(request, response, next)

        expect(flashSpy).toHaveBeenCalledWith('errors', {
          crn: errorMessage('crn', 'Enter a CRN'),
        })
        expect(flashSpy).toHaveBeenCalledWith('errorSummary', [errorSummary('crn', 'Enter a CRN')])
        expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByCrn({}))
      })
    })
  })
})
